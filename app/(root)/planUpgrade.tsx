import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlanType } from "@/types/user";
import { useSession } from "@/providers/AuthProvider";

// Define plan data
const plans = [
  { name: PlanType.Free, credits: 15, price: "Free" },
  { name: PlanType.Plus, credits: 30, price: "₹199/month" },
  { name: PlanType.Pro, credits: 50, price: "₹499/month" },
];

export default function UpgradeSubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>();
  const { session: email } = useSession();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Simulate API call to upgrade subscription
      const res = await fetch("/upgradePlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan.name, email }),
      });

      if (!res.ok) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("Upgrade error:", error);
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 p-6 bg-white dark:bg-black">
        <ThemedText className="text-3xl font-bold text-center mb-8">
          Upgrade Plan
        </ThemedText>

        {/* Plan Selection */}
        <ThemedView className="space-y-4">
          {plans.map((plan) => (
            <Pressable
              key={plan.name}
              onPress={() => setSelectedPlan(plan)}
              className={`p-4 my-4 rounded-lg border ${
                selectedPlan.name === plan.name
                  ? "border-blue-500 "
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <ThemedView className="items-center">
                <ThemedText className="text-lg font-semibold">
                  {plan.name}
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.credits} Credits/Day
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.price}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        {/* Upgrade Button */}
        <Button
          className="py-4 rounded-full items-center mt-8"
          onPress={handleUpgrade}
        >
          {loading
            ? "Upgrading..."
            : success
            ? "Upgraded!"
            : "Upgrade to " + selectedPlan.name}
        </Button>
        {success === false && !loading && (
          <ThemedText className="text-red-500 text-center mt-4">
            Upgrade Failed.
          </ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
