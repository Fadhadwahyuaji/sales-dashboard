import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { customerSchema } from "../../utils/schemas";
import { getProvincesAPI, getCitiesAPI } from "../../api/customer";
import Input from "../../components/common/input";
import Button from "../../components/common/button";
import {
  Building2,
  User,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Save,
  X,
} from "lucide-react";

const CustomerForm = ({
  defaultValues = {},
  onFormSubmit,
  isLoading = false,
  isEditMode = false,
}) => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: defaultValues.name || "",
      email: defaultValues.email || "",
      phone: defaultValues.phone || "",
      mobile_phone: defaultValues.mobile_phone || "",
      address: defaultValues.address || "",
      provinceCode: defaultValues.provinceCode || "",
      cityCode: defaultValues.cityCode || "",
      identityNo: defaultValues.identityNo || "",
      npwp: defaultValues.npwp || "",
      companyType: defaultValues.companyType || "person",
    },
  });

  const selectedProvinceCode = watch("provinceCode");
  const companyType = watch("companyType");

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await getProvincesAPI();
        const provinceList = response?.data?.items || [];
        setProvinces(provinceList);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvinceCode) {
        setCities([]);
        setValue("cityCode", "");
        return;
      }

      try {
        setLoadingCities(true);
        const response = await getCitiesAPI(selectedProvinceCode);
        const cityList = response?.data?.items || [];
        setCities(cityList);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedProvinceCode, setValue]);

  const onSubmit = (data) => {
    onFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Type Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Tipe Customer
          </h3>
        </div>
        <div className="p-6">
          <Controller
            name="companyType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    field.value === "person"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="person"
                    checked={field.value === "person"}
                    onChange={() => field.onChange("person")}
                    className="sr-only"
                  />
                  <User className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Perorangan</p>
                    <p className="text-xs text-gray-500">Customer individu</p>
                  </div>
                </label>

                <label
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    field.value === "company"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="company"
                    checked={field.value === "company"}
                    onChange={() => field.onChange("company")}
                    className="sr-only"
                  />
                  <Building2 className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Perusahaan</p>
                    <p className="text-xs text-gray-500">Customer korporat</p>
                  </div>
                </label>
              </div>
            )}
          />
          {errors.companyType && (
            <p className="mt-2 text-sm text-red-600">
              {errors.companyType.message}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Informasi Dasar
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label={`Nama ${
                companyType === "company" ? "Perusahaan" : "Customer"
              }`}
              id="name"
              placeholder={`Masukkan nama ${
                companyType === "company" ? "perusahaan" : "customer"
              }`}
              error={errors.name}
              {...register("name")}
            />
            <Input
              label="Alamat Lengkap"
              id="address"
              placeholder="Masukkan alamat lengkap"
              error={errors.address}
              {...register("address")}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Informasi Kontak
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="contoh@email.com"
              error={errors.email}
              {...register("email")}
            />
            <Input
              label="Telepon"
              id="phone"
              placeholder="021-1234567"
              error={errors.phone}
              {...register("phone")}
            />
            <Input
              label="No. HP"
              id="mobile_phone"
              placeholder="08123456789"
              error={errors.mobile_phone}
              {...register("mobile_phone")}
              className="sm:col-span-2"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Lokasi
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="provinceCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provinsi
              </label>
              <select
                id="provinceCode"
                {...register("provinceCode")}
                disabled={loadingProvinces}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.provinceCode
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">
                  {loadingProvinces ? "Loading..." : "Pilih Provinsi"}
                </option>
                {provinces.map((prov) => (
                  <option key={prov.code} value={prov.code}>
                    {prov.name}
                  </option>
                ))}
              </select>
              {errors.provinceCode && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.provinceCode.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cityCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Kota/Kabupaten
              </label>
              <select
                id="cityCode"
                {...register("cityCode")}
                disabled={!selectedProvinceCode || loadingCities}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.cityCode
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">
                  {loadingCities
                    ? "Loading..."
                    : selectedProvinceCode
                    ? "Pilih Kota"
                    : "Pilih provinsi terlebih dahulu"}
                </option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.cityCode && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.cityCode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Identity Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Informasi Identitas (Opsional)
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="No. Identitas (KTP/SIM)"
              id="identityNo"
              placeholder="1234567890123456"
              error={errors.identityNo}
              {...register("identityNo")}
            />
            <Input
              label="NPWP"
              id="npwp"
              placeholder="12.345.678.9-012.345"
              error={errors.npwp}
              {...register("npwp")}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/customers")}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? "Update Customer" : "Simpan Customer"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
