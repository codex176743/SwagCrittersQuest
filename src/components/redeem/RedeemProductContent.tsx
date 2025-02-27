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
  setVariantID: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [imageUrl, setImageUrl] = useState<string>(productInfo.image.src);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Watch the selected variant
  const selectedVariant = productInfo.options.map((option: any) =>
    form.watch(option.name)
  );

  // Update imageUrl when selectedVariant changes
  useEffect(() => {
    if (selectedVariant) {
      const title = selectedVariant.join(" / ");
      const selectedVariantInfo = productInfo.variants.find(
        (variant: any) => variant.title === title
      );
      if (selectedVariantInfo) {
        const selectedImage = productInfo.images.find(
          (image: any) => image.id === selectedVariantInfo.image_id
        );
        setVariantID(selectedVariantInfo.id);
        if (title == "Default Title") {
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
          {productInfo.options.map((option: any, index: number) => (
            <FormField
              key={index}
              control={form.control}
              name={option.name}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{option.name}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-1"
                    >
                      {option.values.map((value: any, index: number) => (
                        <FormItem
                          key={index}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={value} />
                          </FormControl>
                          <FormLabel className="font-normal">{value}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormDescription>Choose one variant what you want.</FormDescription>
          <div className="flex">
            <img src={imageUrl} className="border w-[150px] h-[150px]" />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RedeemProductContent;
