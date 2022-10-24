interface SampleDateRecord {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: number;
  longitude: number;
  tags: string[];
  friends: Friend[];
}

interface Friend {
  id: number;
  name: string;
}

interface TagCounts {
  tag: string;
  count: number;
}

interface NewDateRecord {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: number;
  picture: string | null;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  company: string;
  email: string | null;
  phone: string | null;
  address: string;
  about: string;
  registered: string;
  latitude: number;
  longitude: number;
  tags: string[];
  friends: Friend[];
}
