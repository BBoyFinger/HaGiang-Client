import img1 from '@/assets/1.jpg';
import img2 from '@/assets/2.png';
import img3 from '@/assets/3.jpg';
import img4 from '@/assets/4.jpg';
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
    id: '3',
    name: 'Full Manual Motorcycles',
    slug: 'full-manual-motorcycles',
    image: img3,
    description: 'Xe côn tay cho trải nghiệm lái mạnh mẽ, kiểm soát tốt trên mọi địa hình.',
    shortSpecs: 'Côn tay, động cơ mạnh, kiểm soát tốt',
  },
  {
    id: '4',
    name: 'Detech Win 127cc',
    slug: 'detech-win-127cc',
    image: img4,
    description: 'Xe côn tay huyền thoại, phù hợp phượt núi, bền bỉ, dễ sửa chữa.',
    shortSpecs: '127cc, côn tay, bền bỉ',
  },
  {
    id: '5',
    name: 'Suzuki GD 110cc',
    slug: 'suzuki-gd-110cc',
    image: img1,
    description: 'Xe côn tay nhỏ gọn, tiết kiệm xăng, phù hợp di chuyển đường dài.',
    shortSpecs: '110cc, côn tay, tiết kiệm xăng',
  },
  {
    id: '6',
    name: 'Honda CB150 Verza 150cc',
    slug: 'honda-cb150-verza-150cc',
    image: img2,
    description: 'Xe côn tay phân khối lớn, mạnh mẽ, phù hợp cho phượt thủ chuyên nghiệp.',
    shortSpecs: '150cc, côn tay, mạnh mẽ',
  },
  {
    id: '7',
    name: 'Dual Purpose Dirt-bikes',
    slug: 'dual-purpose-dirt-bikes',
    image: img3,
    description: 'Xe địa hình đa dụng, vượt mọi cung đường, thích hợp offroad.',
    shortSpecs: 'Địa hình, đa dụng, offroad',
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