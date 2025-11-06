import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerForm from "./CustomerForm";
import { getCustomerDetailAPI, updateCustomerAPI } from "../../api/customer";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/button";
import { ArrowLeft, Edit } from "lucide-react";

const EditCustomerPage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data customer
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setIsDataLoading(true);
        setError(null);

        const response = await getCustomerDetailAPI(code);

        console.log("Edit Customer Response:", response.data);

        // Sesuaikan dengan struktur response API
        const customerData = response?.data;

        if (customerData && customerData.responseCode === "20000") {
          // Transform data untuk form
          const formData = {
            name: customerData.name || "",
            identityNo: customerData.identityNo || "",
            npwp: customerData.npwp || "",
            email: customerData.email || "",
            phone: customerData.phone || "",
            mobile_phone: customerData.mobilePhone || "", // API: mobilePhone, Form: mobile_phone
            address: customerData.address || "",
            companyType: customerData.companyType || "person",
            provinceCode: customerData.province?.code || "",
            cityCode: customerData.city?.code || "",
          };

          setCustomer(formData);
        } else {
          setError("Data customer tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err?.response?.data?.responseMessage ||
            err?.message ||
            "Gagal memuat data customer."
        );
      } finally {
        setIsDataLoading(false);
      }
    };

    if (code) {
      fetchCustomer();
    }
  }, [code]);

  // Handle update customer
  const handleUpdateCustomer = async (data) => {
    try {
      setIsLoading(true);

      // Transform data untuk API
      const payload = {
        name: data.name?.trim() || "",
        identityNo: data.identityNo?.trim() || "",
        npwp: data.npwp?.trim() || "",
        email: data.email?.trim() || "",
        phone: data.phone?.trim() || "",
        mobile_phone: data.mobile_phone?.trim() || "",
        address: data.address?.trim() || "",
        companyType: data.companyType,
        provinceCode: data.provinceCode,
        cityCode: data.cityCode,
      };

      console.log("Update payload:", payload);

      await updateCustomerAPI(code, payload);

      toast.success("Data customer berhasil diupdate!", {
        duration: 3000,
        position: "top-right",
      });

      navigate(`/customers/${code}`);
    } catch (error) {
      console.error("Error updating customer:", error);

      const apiErrors = error.response?.data?.errors;
      const msg =
        (apiErrors && Object.values(apiErrors).flat().join(", ")) ||
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        "Gagal mengupdate customer.";

      toast.error(msg, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size={48} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6">
            <Button
              onClick={() => navigate("/customers")}
              variant="outline"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <ErrorMessage message={error || "Data tidak ditemukan"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => navigate("/customers")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Edit Customer
                </h1>
                <p className="mt-1 sm:mt-2 text-sm text-gray-600">
                  Perbarui informasi customer:{" "}
                  <span className="font-semibold text-gray-900">
                    {customer?.name || "-"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <CustomerForm
          defaultValues={customer}
          onFormSubmit={handleUpdateCustomer}
          isLoading={isLoading}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default EditCustomerPage;
