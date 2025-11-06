// src/pages/customer/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { customerSchema } from "../../utils/schemas";
import { getProvincesAPI, getCitiesAPI } from "../../api/customer";
import Input from "../../components/common/input";
import Button from "../../components/common/button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Komponen Select/Dropdown sederhana
const Select = React.forwardRef(
  ({ label, id, error, children, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        ref={ref}
        {...props}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  )
);
Select.displayName = "Select";

// Form Utama
const CustomerForm = ({ defaultValues, onFormSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue, // <-- add
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues || {},
  });

  // Ambil data provinsi saat komponen dimuat
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await getProvincesAPI();
        const provincesData =
          res.data?.data || res.data?.items || res.data || [];
        setProvinces(Array.isArray(provincesData) ? provincesData : []);
      } catch (error) {
        console.error("Error loading provinces:", error);
        toast.error(error?.message || "Gagal memuat data provinsi");
        setProvinces([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Ambil data kota saat edit (jika sudah ada provinceCode)
  useEffect(() => {
    const loadCities = async (provinceCode) => {
      if (!provinceCode) return;
      try {
        const res = await getCitiesAPI(provinceCode); // <-- pass provinceCode
        const citiesData = res.data?.data || res.data?.items || res.data || [];
        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (error) {
        console.error("Error loading cities:", error);
        toast.error(error?.message || "Gagal memuat data kota");
        setCities([]);
      }
    };

    if (defaultValues?.provinceCode) {
      loadCities(defaultValues.provinceCode);
    }
  }, [defaultValues]);

  // Pantau perubahan provinceCode
  const selectedProvince = watch("provinceCode");

  useEffect(() => {
    const loadCitiesOnChange = async () => {
      if (!selectedProvince) {
        setCities([]);
        setValue("cityCode", ""); // reset pilihan kota
        return;
      }
      try {
        const res = await getCitiesAPI(selectedProvince); // <-- pass provinceCode
        const citiesData = res.data?.data || res.data?.items || res.data || [];
        setCities(Array.isArray(citiesData) ? citiesData : []);
        setValue("cityCode", ""); // reset ketika provinsi berubah
      } catch (error) {
        console.error("Error loading cities on change:", error);
        toast.error(error?.message || "Gagal memuat data kota");
        setCities([]);
        setValue("cityCode", "");
      }
    };
    loadCitiesOnChange();
  }, [selectedProvince, setValue]);

  if (isDataLoading && !defaultValues)
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Informasi Utama */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Informasi Utama
            </h3>
            <p className="mt-1 text-sm text-gray-600">Data dasar customer</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <Input
                  id="name"
                  label="Nama Customer"
                  placeholder="Masukkan nama customer"
                  {...register("name")}
                  error={errors.name}
                />
              </div>
              <div className="md:col-span-1">
                <Select
                  id="companyType"
                  label="Tipe Perusahaan"
                  {...register("companyType")}
                  error={errors.companyType}
                >
                  <option value="">Pilih Tipe</option>
                  <option value="person">Person</option>
                  <option value="company">Company</option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Informasi Kontak
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Data kontak customer (opsional)
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="customer@email.com"
                {...register("email")}
                error={errors.email}
              />
              <Input
                id="phone"
                label="Telepon"
                placeholder="021-xxxxxxx"
                {...register("phone")}
                error={errors.phone}
              />
              <Input
                id="mobile_phone"
                label="No. HP"
                placeholder="08xxxxxxxxxx"
                {...register("mobile_phone")}
                error={errors.mobile_phone}
              />
              <Input
                id="identityNo"
                label="No. Identitas (KTP/SIM)"
                placeholder="xxxxxxxxxxxxxxxx"
                {...register("identityNo")}
                error={errors.identityNo}
              />
              <Input
                id="npwp"
                label="NPWP"
                placeholder="xx.xxx.xxx.x-xxx.xxx"
                {...register("npwp")}
                error={errors.npwp}
              />
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alamat</h3>
            <p className="mt-1 text-sm text-gray-600">Lokasi customer</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="provinceCode"
                label="Provinsi"
                {...register("provinceCode")}
                error={errors.provinceCode}
              >
                <option value="">Pilih Provinsi</option>
                {Array.isArray(provinces) &&
                  provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
              </Select>

              <Select
                id="cityCode"
                label="Kota/Kabupaten"
                {...register("cityCode")}
                error={errors.cityCode}
                disabled={!selectedProvince || cities.length === 0}
              >
                <option value="">
                  {!selectedProvince
                    ? "Pilih provinsi terlebih dahulu"
                    : "Pilih Kota"}
                </option>
                {Array.isArray(cities) &&
                  cities.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
              </Select>

              <div className="md:col-span-2">
                <Input
                  id="address"
                  label="Alamat Lengkap"
                  placeholder="Jl. Nama Jalan, No. xx, Kecamatan, ..."
                  {...register("address")}
                  error={errors.address}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            onClick={() => navigate("/customers")}
            className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
