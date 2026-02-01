// Типы для данных пользователя и API
export interface User {
  id: number; // ID обычно числовой
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: ('ADMIN' | 'USER')[];
  image?: ImageDTO;
}


export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}


export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber:string;
  password: string;
}

export interface AuthResponse {
  token: string;
  accessToken?: string;
  refreshToken: string;
}

// Тип для контекста аутентификации
export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export type CompetitionStatus =  'DRAFT' | 'OPEN' | 'CLOSED' | 'ONGOING' | 'FINISHED';

export interface CompetitionCreateDTO {
  title: string;
  description: string;
  location: string;
  status: CompetitionStatus;
  startDate: string; // ISO-строка даты, т.к. LocalDate → string на фронте
  endDate: string;
}

export interface ImageDTO {
  id: number;
  url: string;
  title?: string;
}

export interface CompetitionDetailsDTO {
  id: number;
  title: string;
  description: string;
  location: string;
  image?: ImageDTO;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
}

export interface CompetitionSummaryDTO {
  id: number;
  title: string;
  description: string;
  location: string;
  image?: string;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
}

export interface CompetitionUpdateDTO {
  title: string;
  description: string;
  location: string;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
}

export interface RobotDTO {
  name: string;
  description: string;
}

export interface RobotResponseDTO {
  id: number;
  name: string;
  description: string;
  image?: ImageDTO;
}

export interface TeamCreateDTO {
  name: string;
  description: string;
}

export interface TeamUpdateDTO {
  name: string;
  description: string;
}

export interface TeamMemberAddDTO {
  userId: number;
  role: string;
}

export interface TeamMemberDTO {
  fullName: string;
  role: string;
}

export interface TeamMemberResponseDTO {
  memberRecordId: number;
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface TeamResponseDTO {
  id: number;
  name: string;
  description: string;
  image?: ImageDTO;
  robot: RobotResponseDTO | null;
  members: TeamMemberResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamSummaryDTO {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface UserSummaryDTO {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ProductDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  sellerUsername: string;
  imageUrls: string[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  productTitle: string;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderResponse {
  id: number;
  createdAt: string;
  status: string;
  totalPrice: number;
  items: OrderItemResponse[];
}

// Тип для товара в корзине (на фронте мы храним чуть больше инфы, чем отправляем на бэк)
export interface CartItem extends ProductDTO {
  quantityInCart: number;
}