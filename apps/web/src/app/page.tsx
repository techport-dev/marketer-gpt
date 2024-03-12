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
import Messages from "@/components/messages";
import CommentGenerateForm from "@/components/form/CommentGenerateForm";

export default function Home() {
  return (
    <section className="container my-5">
      <div className="flex gap-x-5">
        <Tabs defaultValue="title" className="w-[500px]">
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
                <CardDescription>
                  Generate a comment/comment reply for your post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommentGenerateForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex-1 max-h-[80vh] border overflow-y-auto mt-12 rounded">
          <Messages />
        </div>
      </div>
    </section>
  );
}
