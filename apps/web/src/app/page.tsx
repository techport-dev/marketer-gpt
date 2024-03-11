import TitleGenerateForm from "@/components/form/TitleGenerateForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <section className="container my-5">
      <div className="grid grid-cols-2">
        <Tabs defaultValue="title" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="title">Title</TabsTrigger>
            <TabsTrigger value="comment">Comment</TabsTrigger>
          </TabsList>
          <TabsContent value="title">
            <Card>
              <CardHeader>
                <CardTitle>Post Title</CardTitle>
                <CardDescription>
                  Generate a title for your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <TitleGenerateForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comment">
            <Card>
              <CardHeader>
                <CardTitle>Comment</CardTitle>
              </CardHeader>
              <CardDescription>
                Generate a comment for your post
              </CardDescription>
              <CardContent className="space-y-2"></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
