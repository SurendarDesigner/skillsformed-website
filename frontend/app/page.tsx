import { fetchAPI } from "@/lib/strapi";
import Slider from "@/components/Slider/Slider";
import { SliderItem } from "@/components/Slider/types";
import Trustedsection from "@/components/Trustedsection/Trustedsection";
import { TrustedSectionData } from "@/components/Trustedsection/types";


interface StrapiImage {
  url: string;
  alternativeText?: string;
}

// Support both wrapped and unwrapped structures just in case
type StrapiImageField = StrapiImage[] | { data: StrapiImage[] | { attributes: StrapiImage } | null } | null;

interface SliderComponent {
  id: number;
  Title: string;
  Description: string;
  cta?: string;
  Desktopimages?: StrapiImageField;
  Mobileimages?: StrapiImageField;
  Images?: StrapiImageField;
  [key: string]: unknown;
}

interface HomeData {
  sliderItems: SliderItem[];
  trustedSectionData: TrustedSectionData | null;
}

async function getHomeData(): Promise<HomeData> {
  try {
    // Fetch Home single type, populating Slider and Trustedsection
    // Explicitly populate Icon to ensure media is retrieved
    const res = await fetchAPI('/api/home?populate[Slider][populate]=*&populate[Trustedsection][populate][Trustlist][populate][Icon][fields][0]=url&populate[Trustedsection][populate][Trustlist][populate][Icon][fields][1]=alternativeText&populate[Trustedsection][populate][Trustlist][populate][Icon][fields][2]=width&populate[Trustedsection][populate][Trustlist][populate][Icon][fields][3]=height');

    if (!res || !res.data) {
      console.log("Strapi response missing data:", res);
      return { sliderItems: [], trustedSectionData: null };
    }

    const homeAttributes = res.data.attributes || res.data;

    // --- Process Slider ---
    const sliderData = homeAttributes.Slider;
    let mappedSliderItems: SliderItem[] = [];

    if (sliderData && Array.isArray(sliderData)) {
      mappedSliderItems = sliderData.map((item: SliderComponent) => {
        const extractImg = (field: StrapiImageField | undefined) => {
          if (!field) return undefined;
          if (Array.isArray(field)) {
            const first = field[0];
            return first ? { url: first.url, alternativeText: first.alternativeText } : undefined;
          }
          if ('data' in field && field.data) {
            const data = field.data;
            if (Array.isArray(data)) {
              const first = data[0];
              if (first && typeof first === 'object' && 'attributes' in first) {
                const attr = (first as { attributes: StrapiImage }).attributes;
                return { url: attr.url, alternativeText: attr.alternativeText };
              }
              const direct = first as StrapiImage;
              return { url: direct.url, alternativeText: direct.alternativeText };
            } else {
              if (data && typeof data === 'object' && 'attributes' in data) {
                const attr = (data as { attributes: StrapiImage }).attributes;
                return { url: attr.url, alternativeText: attr.alternativeText };
              }
              const direct = data as StrapiImage;
              return { url: direct.url, alternativeText: direct.alternativeText };
            }
          }
          return undefined;
        };

        return {
          id: item.id,
          Title: item.Title,
          Description: item.Description,
          cta: item.cta || "Learn Now",
          Desktopimages: extractImg(item.Desktopimages),
          Mobileimages: extractImg(item.Mobileimages),
          Images: extractImg(item.Images) || { url: '', alternativeText: '' }
        };
      });
    }

    // --- Process Trustedsection ---
    const trustedData = homeAttributes.Trustedsection;

    return {
      sliderItems: mappedSliderItems,
      trustedSectionData: trustedData || null
    };

  } catch (error) {
    console.error("Error fetching home data:", error);
    return { sliderItems: [], trustedSectionData: null };
  }
}

export default async function Home() {
  const { sliderItems, trustedSectionData } = await getHomeData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between home-main-container">
      <Slider items={sliderItems} />
      <Trustedsection data={trustedSectionData} />
    </main>
  );
}
