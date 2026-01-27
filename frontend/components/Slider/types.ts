export interface SliderImage {
    url: string;
    alternativeText?: string;
}

export interface SliderItem {
    id: number;
    Title: string;
    Description: string;
    cta?: string;
    Images: SliderImage;
    Desktopimages?: SliderImage;
    Mobileimages?: SliderImage;
}

export interface SliderProps {
    items: SliderItem[];
}
