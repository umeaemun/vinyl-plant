export interface PriceTier {
  id?: string;
  quantity: number;
  size: string;
  type: string;
  price: number;
  status? : string;
}

export interface ColorOption {
  id?: string;
  name: string;
  additionalCost: number;
  status? : string;

}

export interface WeightOption {
  id?: string;
  name: string;
  additionalCost: number;
  status? : string;

}

export interface PackagingPrice {
  id?: string;
  type: 'innerSleeve' | 'jacket' | 'inserts' | 'shrinkWrap';
  option: string;
  prices: Array<{
    quantity: number;
    price: number;
  }>;
}

export interface PlantFeature {
  id: string;
  name: string;
  description: string;
}

export interface PlantReview {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  country: string;
  owner: string;
  description: string;
  minimum_order: number;
  turnaround_time: string;
  rating: number;
  review_count: number;
  features: string[];
  image_url: string;
  website: string;
  // reviews: PlantReview[];
}

export const features: PlantFeature[] = [
  {
    id: 'colored-vinyl',
    name: 'Colored Vinyl',
    description: 'Ability to press records in various colors and effects like splatter, marble, etc.'
  },
  {
    id: 'picture-disc',
    name: 'Picture Disc',
    description: 'Ability to produce picture discs with images embedded in the vinyl.'
  },
  {
    id: 'heavyweight',
    name: 'Heavyweight Vinyl',
    description: 'Offers 180g or heavier vinyl pressing options for superior audio quality.'
  },
  {
    id: 'eco-friendly',
    name: 'Eco-Friendly',
    description: 'Uses recycled materials or environmentally sustainable processes.'
  },
  {
    id: 'packaging',
    name: 'Custom Packaging',
    description: 'Offers custom sleeve, jacket, and insert printing and production.'
  },
  {
    id: 'mastering',
    name: 'In-house Mastering',
    description: 'Provides vinyl mastering services for optimal sound quality.'
  },
  {
    id: 'short-run',
    name: 'Short-run Capability',
    description: 'Accepts orders below 500 units.'
  },
  {
    id: 'digital',
    name: 'Digital Distribution',
    description: 'Offers digital distribution alongside physical production.'
  },
  {
    id: 'splatter-vinyl',
    name: 'Splatter Vinyl',
    description: 'Specialized in creating splatter effect vinyl records with unique patterns.'
  },
  {
    id: 'marbled-vinyl',
    name: 'Marbled Vinyl',
    description: 'Capability to produce marbled effect vinyl with swirling color patterns.'
  },
  {
    id: 'multi-color',
    name: 'Other Multi-Colour features',
    description: 'Various multi-color vinyl pressing options beyond standard techniques.'
  },
  {
    id: 'low-carbon',
    name: 'Low Carbon/Bio-Vinyl',
    description: 'Environmentally friendly vinyl pressing using sustainable bio-materials.'
  },
  {
    id: 'direct-metal-mastering',
    name: 'Direct Metal Mastering',
    description: 'Offers direct metal mastering for higher quality sound reproduction.'
  },
  {
    id: 'lacquer-cutting',
    name: 'Lacquer Cutting',
    description: 'In-house lacquer cutting services for vinyl master production.'
  },
  {
    id: 'in-house-metal',
    name: 'In-house Metal Work',
    description: 'Complete metal parts manufacturing capabilities within the facility.'
  },
  {
    id: 'in-house-lacquer',
    name: 'In-house Lacquer Cutting',
    description: 'Specialized lacquer cutting services performed on-site for quality control.'
  },
  {
    id: 'seven-inch',
    name: '7" Records',
    description: 'Capability to press 7-inch vinyl records, common for singles.'
  },
  {
    id: 'ten-inch',
    name: '10" Records',
    description: 'Capability to press 10-inch vinyl records, offering an alternative size option.'
  }
];

export const plants: Plant[] = [
  {
    id: '1',
    name: 'Vinyl Press Co.',
    location: 'Nashville, TN',
    country: 'USA',
    owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
    description: 'A boutique pressing plant specializing in high-quality, custom vinyl records for independent artists and labels.',
    minimum_order: 300,
    turnaround_time: '10-12 weeks',
    rating: 4.8,
    review_count: 124,
    features: ['colored-vinyl', 'heavyweight', 'packaging', 'mastering'],
    image_url: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491',
    website: 'https://example.com/vinylpressco',
    // reviews: [
    //   {
    //     id: 'r1',
    //     username: 'IndieLabel123',
    //     rating: 5,
    //     comment: 'Exceptional quality and customer service. Our limited edition colored vinyl run came out perfectly.',
    //     date: '2023-12-10'
    //   },
    //   {
    //     id: 'r2',
    //     username: 'VinylCollector',
    //     rating: 4,
    //     comment: 'Great quality, but turnaround time was longer than quoted by about 2 weeks.',
    //     date: '2023-11-15'
    //   }
    // ]
  },
  {
    id: '2',
    name: 'Classic Pressings',
    location: 'Detroit, MI',
    country: 'USA',
    owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
    description: 'One of the oldest pressing plants in America, with decades of experience and vintage equipment for that authentic sound.',
    minimum_order: 500,
    turnaround_time: '14-16 weeks',
    rating: 4.5,
    review_count: 276,
    features: ['heavyweight', 'packaging', 'mastering'],
    image_url: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10',
    website: 'https://example.com/classicpressings',
    // reviews: [
    //   {
    //     id: 'r3',
    //     username: 'BluesLabel',
    //     rating: 5,
    //     comment: 'The sound quality is unmatched. Worth the wait for the premium pressing.',
    //     date: '2023-10-22'
    //   },
    //   {
    //     id: 'r4',
    //     username: 'VinylProducer',
    //     rating: 4,
    //     comment: 'Excellent sound, but be prepared for longer waits than quoted.',
    //     date: '2023-09-30'
    //   }
    // ]
  },
  {
    id: '3',
    name: 'EcoVinyl',
    location: 'Portland, OR',
    country: 'USA',
    owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
    description: 'An environmentally conscious pressing plant using recycled materials and renewable energy.',
    minimum_order: 200,
    turnaround_time: '8-10 weeks',
    rating: 4.2,
    review_count: 98,
    features: ['eco-friendly', 'colored-vinyl', 'short-run', 'digital'],
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aeaa20',
    website: 'https://example.com/ecovinyl',
    // reviews: [
    //   {
    //     id: 'r5',
    //     username: 'GreenArtist',
    //     rating: 5,
    //     comment: 'Love the eco-friendly approach, and the quality is excellent!',
    //     date: '2023-11-05'
    //   },
    //   {
    //     id: 'r6',
    //     username: 'SmallLabelOwner',
    //     rating: 3,
    //     comment: 'Good quality but pricier than most competitors.',
    //     date: '2023-10-14'
    //   }
    // ]
  },
  {
    id: '4',
    name: 'The Vinyl Factory',
    location: 'Manchester',
    country: 'UK',
    owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
    description: 'A full-service vinyl production facility with a focus on electronic and dance music genres.',
    minimum_order: 300,
    turnaround_time: '12-14 weeks',
    rating: 4.6,
    review_count: 188,
    features: ['colored-vinyl', 'picture-disc', 'packaging', 'digital'],
    image_url: 'https://images.unsplash.com/photo-1583207836464-2f467abb3c99',
    website: 'https://example.com/vinylfactory',
    // reviews: [
    //   {
    //     id: 'r7',
    //     username: 'DJProducer',
    //     rating: 5,
    //     comment: 'Their colored vinyl and picture discs are amazing quality. Perfect for our label releases.',
    //     date: '2023-12-01'
    //   },
    //   {
    //     id: 'r8',
    //     username: 'RecordCollector',
    //     rating: 4,
    //     comment: 'Great quality but shipping to US was expensive and slow.',
    //     date: '2023-10-28'
    //   }
    // ]
  },
  {
    id: '5',
    name: 'Pacific Press',
    location: 'Los Angeles, CA',
    country: 'USA',
    owner: "3e266c65-ad3f-4d80-a3a2-9e972edb93d8",
    description: 'A modern, high-capacity plant with fast turnaround times and a focus on mainstream music.',
    minimum_order: 1000,
    turnaround_time: '6-8 weeks',
    rating: 4.1,
    review_count: 245,
    features: ['colored-vinyl', 'packaging', 'digital'],
    image_url: 'https://images.unsplash.com/photo-1576615278693-f8e095e37e01',
    website: 'https://example.com/pacificpress',
    // reviews: [
    //   {
    //     id: 'r9',
    //     username: 'MajorLabel',
    //     rating: 4,
    //     comment: 'Fast and reliable for larger runs. Good quality control.',
    //     date: '2023-11-18'
    //   },
    //   {
    //     id: 'r10',
    //     username: 'FilmProducer',
    //     rating: 5,
    //     comment: 'Excellent for our soundtrack releases. Quick turnaround is great.',
    //     date: '2023-09-22'
    //   }
    // ]
  }
];

export const getFeatureName = (featureId: string): string => {
  const feature = features.find(f => f.id === featureId);
  return feature ? feature.name : 'Unknown Feature';
};

export const getFeatureDescription = (featureId: string): string => {
  const feature = features.find(f => f.id === featureId);
  return feature ? feature.description : '';
};
