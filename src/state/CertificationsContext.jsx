import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { certificationsApi } from "../lib/api.js";

const CertificationsContext = createContext(null);

export const CATEGORY_OPTIONS = [
  "Technology",
  "Business",
  "Health & Safety",
  "Finance",
  "Education",
  "Marketing",
  "Other",
];

export function CertificationsProvider({ children }) {
  const [certifications, setCertifications] = useState([]);

  // ✅ SAFE DEFAULT SUMMARY (fixes empty dashboard)
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    upcoming: [],
    recent: [],
    categories: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [items, summaryPayload] = await Promise.all([
        certificationsApi.list(),
        certificationsApi.summary(),
      ]);

      setCertifications(items || []);

      // ✅ Ensure summary always has structure
      setSummary(
        summaryPayload || {
          total: 0,
          active: 0,
          expiringSoon: 0,
          expired: 0,
          upcoming: [],
          recent: [],
          categories: [],
        }
      );

      setError("");
    } catch (loadError) {
      console.error("API ERROR:", loadError);
      setError(loadError.message || "Failed to load data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const actions = useMemo(
    () => ({
      reload: () => loadData({ silent: true }),

      async addCertification(values) {
        const created = await certificationsApi.create(values);
        setCertifications((current) => [...current, created]);
        await loadData({ silent: true });
        toast.success("Certification added successfully.");
        return created;
      },

      async updateCertification(id, values) {
        const updated = await certificationsApi.update(id, values);
        setCertifications((current) =>
          current.map((item) => (item.id === id ? updated : item))
        );
        await loadData({ silent: true });
        toast.success("Certification updated successfully.");
        return updated;
      },

      async deleteCertification(id) {
        await certificationsApi.remove(id);
        setCertifications((current) =>
          current.filter((item) => item.id !== id)
        );
        await loadData({ silent: true });
        toast.success("Certification deleted successfully.");
      },

      getCertificationById(id) {
        return certifications.find((item) => item.id === id);
      },
    }),
    [certifications]
  );

  const value = useMemo(
    () => ({
      certifications,
      summary,
      loading,
      refreshing,
      error,
      ...actions,
    }),
    [actions, certifications, error, loading, refreshing, summary]
  );

  return (
    <CertificationsContext.Provider value={value}>
      {children}
    </CertificationsContext.Provider>
  );
}

export function useCertifications() {
  const context = useContext(CertificationsContext);
  if (!context) {
    throw new Error("useCertifications must be used within CertificationsProvider");
  }
  return context;
}
