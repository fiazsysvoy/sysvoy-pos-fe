import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MenuTabs() {
  return (
    <Tabs defaultValue="normal">
      <TabsList className="bg-zinc-800">
        <TabsTrigger value="normal">Normal Menu</TabsTrigger>
        <TabsTrigger value="deals">Special Deals</TabsTrigger>
        <TabsTrigger value="newyear">New Year Special</TabsTrigger>
        <TabsTrigger value="desserts">Desserts and Drinks</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
