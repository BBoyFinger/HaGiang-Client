import img1 from '@/assets/vehicles/wave110cc.png';
import img2 from '@/assets/vehicles/Honda-Blade-2024-6.jpg';
import img3 from '@/assets/vehicles/detech_win.png';
import img4 from '@/assets/vehicles/XR150-abs.png';
import { Vehicle } from '@/types/VehicleType';



export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Honda Wave 110cc',
    slug: 'honda-wave-110cc',
    image: img1,
    description: 'Xe số phổ thông, tiết kiệm xăng, dễ sử dụng, phù hợp mọi đối tượng.',
    shortSpecs: '110cc, số tự động, tiết kiệm xăng',
  },
  {
    id: '2',
    name: 'Honda Blade 110cc',
    slug: 'honda-blade-110cc',
    image: img2,
    description: 'Thiết kế thể thao, động cơ mạnh mẽ, bền bỉ, phù hợp phượt đường dài.',
    shortSpecs: '110cc, số tự động, thể thao',
  },
  {
    id: '4',
    name: 'Detech Win 127cc',
    slug: 'detech-win-127cc',
    image: img3,
    description: 'Xe côn tay huyền thoại, phù hợp phượt núi, bền bỉ, dễ sửa chữa.',
    shortSpecs: '127cc, côn tay, bền bỉ',
  },
  {
    id: '8',
    name: 'Honda XR150L 150cc',
    slug: 'honda-xr150l-150cc',
    image: img4,
    description: 'Xe cào cào phân khối lớn, vượt địa hình cực tốt, bền bỉ.',
    shortSpecs: '150cc, cào cào, vượt địa hình',
  },
];
