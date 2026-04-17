import { useTanstackMutation } from "@/hooks/use-tanstack";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useTanstack } from "@/hooks/use-tanstack";
import type { AcupointModel, MeridianModel } from "@/models";

interface AcupointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acupoint?: AcupointModel | null;
  onSuccess: () => void;
}

export function AcupointModal({
  open,
  onOpenChange,
  acupoint,
  onSuccess,
}: AcupointModalProps) {
  const [formData, setFormData] = useState<Partial<AcupointModel>>({
    code: "",
    name_vi: "",
    meridian_id: undefined,
    location: "",
    indication: "",
  });

  const { data: meridians = [] } = useTanstack<MeridianModel[]>(
    "/meridians",
    "meridians",
  );

  useEffect(() => {
    if (acupoint) {
      setFormData(acupoint);
    } else {
      setFormData({
        code: "",
        name_vi: "",
        meridian_id: undefined,
        location: "",
        indication: "",
      });
    }
  }, [acupoint, open]);

  const mutation = useTanstackMutation(
    acupoint ? `/acupoints/${acupoint.id}` : "/api/acupoints",
    acupoint ? "PUT" : "POST",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        url: acupoint ? `/acupoints/${acupoint.id}` : "/api/acupoints",
        data: formData,
        method: acupoint ? "PUT" : "POST",
      });
      setFormData({
        code: "",
        name_vi: "",
        meridian_id: undefined,
        location: "",
        indication: "",
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving acupoint:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>
            {acupoint ? "Chỉnh Sửa Huyệt" : "Thêm Huyệt Mới"}
          </SheetTitle>
          <SheetDescription>
            {acupoint
              ? "Cập nhật thông tin huyệt"
              : "Thêm huyệt mới vào hệ thống"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className='space-y-4 mt-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Mã *</label>
            <Input
              value={formData.code || ""}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              placeholder='Ví dụ: LI4, ST36'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Tên Tiếng Việt *</label>
            <Input
              value={formData.name_vi || ""}
              onChange={e =>
                setFormData({ ...formData, name_vi: e.target.value })
              }
              placeholder='Ví dụ: Hợp Cốc'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Kinh Lạc *</label>
            <select
              value={formData.meridian_id || ""}
              onChange={e =>
                setFormData({
                  ...formData,
                  meridian_id: Number(e.target.value),
                })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              required>
              <option value=''>Chọn kinh lạc</option>
              {meridians.map((meridian: MeridianModel) => (
                <option key={meridian.id} value={meridian.id}>
                  {meridian.name_vi}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Vị Trí</label>
            <textarea
              value={formData.location || ""}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder='Mô tả vị trí'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              rows={2}
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Chỉ Định</label>
            <textarea
              value={formData.indication || ""}
              onChange={e =>
                setFormData({ ...formData, indication: e.target.value })
              }
              placeholder='Chỉ định y tế'
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              rows={2}
            />
          </div>

          <div className='flex gap-2 pt-4'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
