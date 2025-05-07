
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Disc, Package, FileBox } from 'lucide-react';

const VinylGlossary = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Vinyl Record Glossary</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Understanding the terminology and specifications for vinyl record manufacturing can be challenging. 
              This glossary provides definitions and explanations for the terms used throughout our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Disc className="h-6 w-6 text-wwwax-green" />
                <h2 className="text-xl font-semibold">Quick Links</h2>
              </div>
              <Separator className="my-4" />
              <ul className="space-y-2">
                <li><a href="#vinyl-specs" className="text-blue-600 hover:underline">Vinyl Specifications</a></li>
                <li><a href="#packaging-specs" className="text-blue-600 hover:underline">Packaging Specifications</a></li>
                <li><a href="#manufacturing-process" className="text-blue-600 hover:underline">Manufacturing Process</a></li>
              </ul>
            </Card>
            
            <div className="col-span-1 md:col-span-2">
              <section id="vinyl-specs" className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Disc className="h-7 w-7 text-wwwax-green" />
                  <h2 className="text-2xl font-semibold">Vinyl Specifications</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="size">
                    <AccordionTrigger className="text-lg font-medium">
                      Size
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The physical diameter of the vinyl record, measured in inches:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>7" (45 RPM Single)</strong> - Typically used for singles with 1-2 songs per side. Also called "45s" due to their standard playback speed.</li>
                        <li><strong>10" (EP)</strong> - Extended play format that sits between singles and full albums. Less common than 7" or 12" formats.</li>
                        <li><strong>12" (LP)</strong> - The standard size for full-length albums. Offers the most playing time and typically plays at 33⅓ RPM.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="type">
                    <AccordionTrigger className="text-lg font-medium">
                      Type
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Refers to the number of vinyl discs in a single release:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>1LP</strong> - A single vinyl record, typically containing an album of 35-45 minutes total playing time.</li>
                        <li><strong>2LP</strong> - Double album containing two vinyl records, often used for longer albums or special editions with additional content.</li>
                        <li><strong>3LP</strong> - Triple album containing three vinyl records, used for very long albums, compilations, or box sets.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="weight">
                    <AccordionTrigger className="text-lg font-medium">
                      Weight
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The thickness/weight of the vinyl material, measured in grams:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>140gm (Standard)</strong> - The standard weight for vinyl records. Provides a good balance of sound quality, durability, and cost-effectiveness.</li>
                        <li><strong>180gm</strong> - Heavyweight premium vinyl that offers greater durability, potentially improved sound quality, and less prone to warping. Preferred for audiophile editions.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="colour">
                    <AccordionTrigger className="text-lg font-medium">
                      Colour
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The visual appearance of the vinyl material:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Standard Black</strong> - Traditional black vinyl, which many audiophiles believe offers the best sound quality.</li>
                        <li><strong>Solid Colour</strong> - Vinyl pressed in a single uniform color (red, blue, green, white, etc).</li>
                        <li><strong>Translucent Colour</strong> - Semi-transparent colored vinyl that allows light to pass through.</li>
                        <li><strong>Marbled</strong> - Vinyl with a swirled pattern of two or more colors blended together.</li>
                        <li><strong>Splatter</strong> - Vinyl with one base color and contrasting "splattered" colors across the surface.</li>
                        <li><strong>Picture Disc</strong> - Vinyl with printed images on the playing surface. While visually striking, these may have slightly reduced audio quality.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
              
              <section id="packaging-specs" className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-7 w-7 text-wwwax-green" />
                  <h2 className="text-2xl font-semibold">Packaging Specifications</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="inner-sleeve">
                    <AccordionTrigger className="text-lg font-medium">
                      Inner Sleeve
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The sleeve that directly holds the vinyl record:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>White Paper</strong> - Basic paper inner sleeve. Economical but offers less protection against dust and static.</li>
                        <li><strong>White Poly-lined</strong> - Paper sleeve with an anti-static polyethylene lining that helps reduce static and protect the record.</li>
                        <li><strong>Black Paper</strong> - Similar to white paper but in black, often used for aesthetic reasons.</li>
                        <li><strong>Black Poly-lined</strong> - Black paper sleeve with anti-static polyethylene lining.</li>
                        <li><strong>Printed</strong> - Custom-printed inner sleeves, often featuring lyrics, artwork, or additional content.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="jacket">
                    <AccordionTrigger className="text-lg font-medium">
                      Jacket
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The outer cover that houses the record and inner sleeve:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Single Pocket Jacket (3mm Spine)</strong> - Standard album cover with one opening and a thin spine, suitable for single records.</li>
                        <li><strong>Single Pocket Jacket (5mm Spine)</strong> - Similar to the 3mm version but with a thicker spine to accommodate additional materials like heavyweight vinyl or booklets.</li>
                        <li><strong>Gatefold Jacket</strong> - Album cover that opens like a book, providing twice the surface area for artwork and liner notes. Often used for double albums or special editions.</li>
                        <li><strong>Trifold Jacket</strong> - Album cover that folds out twice, offering three panels of artwork space. Used for deluxe editions or multi-record sets.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="inserts">
                    <AccordionTrigger className="text-lg font-medium">
                      Inserts
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Additional printed materials included with the record:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>No Insert</strong> - No additional printed materials included.</li>
                        <li><strong>Single Insert</strong> - A printed sheet or booklet included with the record, typically containing lyrics, credits, photos, or liner notes.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shrink-wrap">
                    <AccordionTrigger className="text-lg font-medium">
                      Shrink Wrap
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">The protective plastic film wrapped around the finished product:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Yes</strong> - The record is sealed in transparent plastic film, protecting it from dust and damage during shipping and retail display.</li>
                        <li><strong>No</strong> - The record is not wrapped in plastic. Less common for new releases but may be preferred for certain artistic or environmental reasons.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
              
              <section id="manufacturing-process" className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <FileBox className="h-7 w-7 text-wwwax-green" />
                  <h2 className="text-2xl font-semibold">Manufacturing Process</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="mastering">
                    <AccordionTrigger className="text-lg font-medium">
                      Mastering
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>The process of creating the master lacquer disc from which vinyl records will be pressed. This involves translating the digital or analog audio into physical grooves using specialized equipment. A skilled mastering engineer optimizes the audio specifically for vinyl, accounting for the format's unique characteristics.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="plating">
                    <AccordionTrigger className="text-lg font-medium">
                      Plating
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>The process of creating metal stampers from the master lacquer. The lacquer is coated with silver, then electroplated with nickel to create a negative "father" copy. This father can be used to create multiple "mother" copies, which in turn are used to create the metal stampers that will press the actual vinyl records.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pressing">
                    <AccordionTrigger className="text-lg font-medium">
                      Pressing
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>The final stage where vinyl pellets are melted, colored if needed, and pressed between two stampers under heat and pressure to create the finished record. Labels are applied at the same time, and the records are then trimmed and cooled before quality control checks.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </div>
          </div>
          
          <div className="bg-muted p-6 rounded-lg mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-wwwax-green" />
              <h3 className="text-lg font-medium">Need More Information?</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have specific questions about vinyl manufacturing or need advice on your project, 
              our team is here to help. Contact us for personalized guidance.
            </p>
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact Us</a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get in touch with our vinyl experts</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/" className="text-blue-600 hover:underline font-medium">Get a Quote</a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start your vinyl project</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VinylGlossary;
