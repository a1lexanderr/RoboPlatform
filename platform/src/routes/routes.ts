import Home from "@/pages/Home"
import Gallery from "@/pages/Gallery"
import News from "@/pages/News"
import { ComponentType} from 'react';

interface Route {
  path: string;
  element: ComponentType;
}


export const routes: Route[] = [
    { path: '/', element: Home },
    { path: '/gallery', element: Gallery },
    { path: '/news', element: News },
    
  ];



