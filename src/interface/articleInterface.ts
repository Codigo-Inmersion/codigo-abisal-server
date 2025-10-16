export interface ArticleAttributes {
  id: number;
  creator_id: number; //TENER EN CUENTA QUE DEBE VENIR DEL MODELO DE USER
  title: string;
  description: string;
  content:string;
  category: string;
  species: string;
  image?: string;
  references?: string;
  likes: number;
  created_at: Date;
  updated_at: Date;
}