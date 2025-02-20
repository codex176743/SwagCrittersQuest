"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FormSchema = z.object({
  variant: z.string().nonempty(),
});

const RedeemProductContent = ({
  productInfo,
  setVariantID,
}: {
  productInfo: any;
  setVariantID: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const variants = productInfo.variants.map((variant: any) => variant.title);
  const [imageUrl, setImageUrl] = useState<string>(productInfo.image.src);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      variant: variants[0],
    },
  });

  // Watch the selected variant
  const selectedVariant = form.watch("variant");

  // Update imageUrl when selectedVariant changes
  useEffect(() => {
    if (selectedVariant) {
      const selectedVariantInfo = productInfo.variants.find(
        (variant: any) => variant.title === selectedVariant
      );
      if (selectedVariantInfo) {
        const selectedImage = productInfo.images.find(
          (image: any) => image.id === selectedVariantInfo.image_id
        );
        setVariantID(selectedVariantInfo.id);
        if (selectedVariant == "Default Title") {
          setImageUrl(productInfo.image.src);
        } else {
          setImageUrl(selectedImage.src);
        }
      }
    }
  }, [selectedVariant]);

  return (
    <Form {...form}>
      <form className="space-y-3">
        <DialogHeader>
          <DialogTitle>REDEEM</DialogTitle>
          <DialogDescription>
            Confirm your product + shipping address.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogTitle>PRODUCTS</DialogTitle>
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-semibold">{productInfo.title}</p>
          <FormField
            control={form.control}
            name="variant"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{productInfo.options[0].name}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-1"
                  >
                    {variants.map((variant: any, index: number) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={variant} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {variant.toUpperCase()}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription>Choose one what you want.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <img src={imageUrl} className="border w-[150px] h-[150px]" />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RedeemProductContent;
