export interface PriceTier {
  id?: string;
  quantity: number;
  size: string;
  type: string;
  price: number;
  status?: string;
}

export interface PricingData {
  id: string;
  name: string;
  location: string;
  country: string;
  calculatedPricing: {
    vinylPrice: number;
    packagingPrice: number;
    perUnit: number;
    valid: boolean;
  };
}

export interface PackagingPrice {
  id?: string;
  type: "innerSleeve" | "jacket" | "inserts" | "shrinkWrap";
  option: string;
  prices: Array<{
    quantity: number;
    price: number;
  }>;
  status?: string;
}

export interface ColorOption {
  id?: string;
  color: string;
  additional_cost: number;
  status?: string;
}

export interface WeightOption {
  id?: string;
  weight: string;
  additional_cost: number;
  status?: string;
}

export interface plantEquipments {
  id?: string;
  plant_id?: string;
  name: string;
  model: string;
  description: string;
  status?: string;
  created_at?: string;
}

export interface PlantReviews {
  id?: string;
  name: string;
  type: string;
  notable_work: string;
  status?: string;
  created_at?: string;
}

export interface PlantFeature {
  id: string;
  name: string;
  description: string;
}

export interface PlantReview {
  id: string;
  username: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  country: string;
  owner: any;
  description: string;
  minimum_order: number;
  turnaround_time: string;
  rating: number;
  review_count: number;
  features: string[];
  image_url: string;
  website: string;
  reviews: string[];
  split_manufacturing_capable: boolean;
}

export interface OrderSummary {
  name: string;
  email: string;
  quantity: string;
  size: string;
  type: string;
  weight: string;
  colour: string;
  innerSleeve: string;
  jacket: string;
  inserts: string;
  shrinkWrap: string;
  perUnit: number;
  totalPrice: GLfloat;
  splitManufacturing?: boolean;
  splitManufacturingDetails?: any[];
}

export const features: PlantFeature[] = [
  {
    id: "colored-vinyl",
    name: "Colored Vinyl",
    description:
      "Ability to press records in various colors and effects like splatter, marble, etc.",
  },
  {
    id: "picture-disc",
    name: "Picture Disc",
    description:
      "Ability to produce picture discs with images embedded in the vinyl.",
  },
  {
    id: "heavyweight",
    name: "Heavyweight Vinyl",
    description:
      "Offers 180g or heavier vinyl pressing options for superior audio quality.",
  },
  {
    id: "eco-friendly",
    name: "Eco-Friendly",
    description:
      "Uses recycled materials or environmentally sustainable processes.",
  },
  {
    id: "packaging",
    name: "Custom Packaging",
    description:
      "Offers custom sleeve, jacket, and insert printing and production.",
  },
  {
    id: "mastering",
    name: "In-house Mastering",
    description: "Provides vinyl mastering services for optimal sound quality.",
  },
  {
    id: "short-run",
    name: "Short-run Capability",
    description: "Accepts orders below 500 units.",
  },
  {
    id: "digital",
    name: "Digital Distribution",
    description: "Offers digital distribution alongside physical production.",
  },
  {
    id: "splatter-vinyl",
    name: "Splatter Vinyl",
    description:
      "Specialized in creating splatter effect vinyl records with unique patterns.",
  },
  {
    id: "marbled-vinyl",
    name: "Marbled Vinyl",
    description:
      "Capability to produce marbled effect vinyl with swirling color patterns.",
  },
  {
    id: "multi-color",
    name: "Other Multi-Colour features",
    description:
      "Various multi-color vinyl pressing options beyond standard techniques.",
  },
  {
    id: "low-carbon",
    name: "Low Carbon/Bio-Vinyl",
    description:
      "Environmentally friendly vinyl pressing using sustainable bio-materials.",
  },
  {
    id: "direct-metal-mastering",
    name: "Direct Metal Mastering",
    description:
      "Offers direct metal mastering for higher quality sound reproduction.",
  },
  {
    id: "lacquer-cutting",
    name: "Lacquer Cutting",
    description:
      "In-house lacquer cutting services for vinyl master production.",
  },
  {
    id: "in-house-metal",
    name: "In-house Metal Work",
    description:
      "Complete metal parts manufacturing capabilities within the facility.",
  },
  {
    id: "in-house-lacquer",
    name: "In-house Lacquer Cutting",
    description:
      "Specialized lacquer cutting services performed on-site for quality control.",
  },
  {
    id: "seven-inch",
    name: '7" Records',
    description:
      "Capability to press 7-inch vinyl records, common for singles.",
  },
  {
    id: "ten-inch",
    name: '10" Records',
    description:
      "Capability to press 10-inch vinyl records, offering an alternative size option.",
  },
];

// export const plants: Plant[] = [
//   {
//     id: '1',
//     name: 'Vinyl Press Co.',
//     location: 'Nashville, TN',
//     country: 'USA',
//     owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
//     description: 'A boutique pressing plant specializing in high-quality, custom vinyl records for independent artists and labels.',
//     minimum_order: 300,
//     turnaround_time: '10-12 weeks',
//     rating: 4.8,
//     review_count: 124,
//     features: ['colored-vinyl', 'heavyweight', 'packaging', 'mastering'],
//     image_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491',
//     website: 'https://example.com/vinylpressco',
//   },
//   {
//     id: '2',
//     name: 'Classic Pressings',
//     location: 'Detroit, MI',
//     country: 'USA',
//     owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
//     description: 'One of the oldest pressing plants in America, with decades of experience and vintage equipment for that authentic sound.',
//     minimum_order: 500,
//     turnaround_time: '14-16 weeks',
//     rating: 4.5,
//     review_count: 276,
//     features: ['heavyweight', 'packaging', 'mastering'],
//     image_url: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10',
//     website: 'https://example.com/classicpressings',
//   },
//   {
//     id: '3',
//     name: 'EcoVinyl',
//     location: 'Portland, OR',
//     country: 'USA',
//     owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
//     description: 'An environmentally conscious pressing plant using recycled materials and renewable energy.',
//     minimum_order: 200,
//     turnaround_time: '8-10 weeks',
//     rating: 4.2,
//     review_count: 98,
//     features: ['eco-friendly', 'colored-vinyl', 'short-run', 'digital'],
//     image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aeaa20',
//     website: 'https://example.com/ecovinyl',
//   },
//   {
//     id: '4',
//     name: 'The Vinyl Factory',
//     location: 'Manchester',
//     country: 'UK',
//     owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
//     description: 'A full-service vinyl production facility with a focus on electronic and dance music genres.',
//     minimum_order: 300,
//     turnaround_time: '12-14 weeks',
//     rating: 4.6,
//     review_count: 188,
//     features: ['colored-vinyl', 'picture-disc', 'packaging', 'digital'],
//     image_url: 'https://images.unsplash.com/photo-1583207836464-2f467abb3c99',
//     website: 'https://example.com/vinylfactory',
//   },
//   {
//     id: '5',
//     name: 'Pacific Press',
//     location: 'Los Angeles, CA',
//     country: 'USA',
//     owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
//     description: 'A modern, high-capacity plant with fast turnaround times and a focus on mainstream music.',
//     minimum_order: 1000,
//     turnaround_time: '6-8 weeks',
//     rating: 4.1,
//     review_count: 245,
//     features: ['colored-vinyl', 'packaging', 'digital'],
//     image_url: 'https://images.unsplash.com/photo-1576615278693-f8e095e37e01',
//     website: 'https://example.com/pacificpress',
//   }
// ];

export const getFeatureName = (featureId: string): string => {
  const feature = features.find((f) => f.id === featureId);
  return feature ? feature.name : "Unknown Feature";
};

export const getFeatureDescription = (featureId: string): string => {
  const feature = features.find((f) => f.id === featureId);
  return feature ? feature.description : "";
};
