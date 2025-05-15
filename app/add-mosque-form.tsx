"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DialogFooter } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Form schema for adding new mosque
const addMosqueSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  eidTime: z.string().min(5, { message: "Please enter a valid time (e.g., 09:00am)" }),
  jummahTime: z.string().min(5, { message: "Please enter a valid time (e.g., 01:30pm)" }),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export type AddMosqueFormValues = z.infer<typeof addMosqueSchema>

interface AddMosqueFormProps {
  onSubmit: (values: AddMosqueFormValues) => void
  mapClickLocation: { lat: number; lng: number } | null
}

export function AddMosqueForm({ onSubmit, mapClickLocation }: AddMosqueFormProps) {
  const form = useForm<AddMosqueFormValues>({
    resolver: zodResolver(addMosqueSchema),
    defaultValues: {
      name: "",
      address: "",
      eidTime: "09:00am",
      jummahTime: "01:30pm",
      lat: 9.0765,
      lng: 7.4894,
    },
  })

  // Update form values when map click location changes
  useState(() => {
    if (mapClickLocation) {
      form.setValue("lat", mapClickLocation.lat)
      form.setValue("lng", mapClickLocation.lng)
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mosque Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter mosque name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eidTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eid Prayer Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 09:00am" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jummahTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jummah Prayer Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 01:30pm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.0001"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.0001"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormDescription>Click on the map to set the location or enter coordinates manually.</FormDescription>

        <DialogFooter>
          <Button type="submit">Add Mosque</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
