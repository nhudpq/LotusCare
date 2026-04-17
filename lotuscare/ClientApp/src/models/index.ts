export interface PatientModel {
  id: number
  ma_bn: string
  ho_ten: string
  gioi_tinh: number
  ngay_sinh: string
  ma_quoc_tich: string
  so_cmnd: string
  ho_ten_cha: string
  ho_ten_ncs: string
  phone: string
  father_phone: string
  email: string
  tinh: string
  huyen: string
  xa: string
  dia_chi: string
  tien_su_benh: string
  di_ung: string
  hinh_anh: string
  ghi_chu: string
  created_at: string
  updated_at: string
  is_deleted: number
}

export interface MedicalServiceModel {
  id?: string | number
  code: string
  name: string
  description?: string
  price: number
  duration_minutes?: number
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface HerbalFormulaModel {
  id?: number
  code: string
  name: string
  description?: string
  indication?: string
  contraindication?: string
  usage_instructions?: string
  price: number
  is_active: boolean
  created_at?: string
  updated_at?: string
  is_deleted?: number
}

export interface MeridianModel {
  id?: number
  name_vi: string
  type: 0 | 1  // 0=Primary meridians, 1=Extra meridians
  organ_id?: number | null
  is_deleted?: number
  created_at?: string
  updated_at?: string
}

export interface OrganModel {
  id?: number
  name: string
  type: 0 | 1  // 0=Tạng (Organs), 1=Phủ (Bowels)
  created_at?: string
  updated_at?: string
}

export interface AcupointModel {
  id?: number
  code: string
  name_vi: string
  meridian_id: number
  location?: string
  indication?: string
  is_deleted?: number
  created_at?: string
  updated_at?: string
}