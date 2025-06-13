import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegalResourceHub from "@/components/legal-resource-hub";
import LegalFAQHub from "@/components/legal-faq-hub";
import WorldwideLegalNavigator from "@/components/worldwide-legal-navigator";
import { BookOpen, HelpCircle, Globe, Search } from "lucide-react";

export default function LegalResources() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Military Legal Resources
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive legal support network for military personnel worldwide. Access guides, FAQs, 
              and find legal assistance wherever you're stationed.
            </p>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="resources" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="resources" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Resource Hub</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ Center</span>
              </TabsTrigger>
              <TabsTrigger value="navigator" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Worldwide Navigator</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="space-y-6">
              <LegalResourceHub />
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <LegalFAQHub />
            </TabsContent>

            <TabsContent value="navigator" className="space-y-6">
              <WorldwideLegalNavigator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}