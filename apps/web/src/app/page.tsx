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

const tabsCard = [
  {
    key: 1,
    title: "Post Title",
    description: "Generate a title for your post",
    content: <TitleGenerateForm />,
    tabValue: "title",
  },
  {
    key: 2,
    title: "Comment",
    description: "Generate a comment/comment reply for your post",
    content: <CommentGenerateForm />,
    tabValue: "comment",
  },
];

export default function Home() {
  return (
    <>
      <section className="container my-5">
        <div className="flex flex-wrap flex-col-reverse gap-y-5 lg:flex-row lg:gap-x-5">
          <div className="w-full lg:w-1/2 mx-auto">
            <Tabs defaultValue="title">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="title">Title</TabsTrigger>
                <TabsTrigger value="comment">Comment</TabsTrigger>
              </TabsList>
              {tabsCard.map((data) => (
                <TabsContent key={data.key} value={data.tabValue}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{data.title}</CardTitle>
                      <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {data.content}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="flex-1">
            <div className="w-full sticky top-16">
              <Messages />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
