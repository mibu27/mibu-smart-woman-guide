
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Heart, 
  ThumbsUp, 
  ThumbsDown,
  Send,
  User
} from 'lucide-react';
import { toast } from "sonner";

// Mock data for forum posts
const initialPosts = {
  ibu: [
    {
      id: 1,
      author: "Ani",
      title: "Tips mengatur waktu antara mengurus rumah dan anak",
      content: "Saya ingin berbagi pengalaman bagaimana cara mengatur waktu antara mengurus rumah dan anak. Salah satunya adalah dengan membuat jadwal harian yang realistis dan tidak terlalu ketat.",
      likes: 12,
      dislikes: 0,
      comments: [
        { id: 1, author: "Budi", content: "Saya setuju. Membuat jadwal sangat membantu." },
        { id: 2, author: "Cici", content: "Saya juga menerapkan hal yang sama. Sangat efektif!" }
      ],
      date: "2 Mei 2025"
    },
    {
      id: 2,
      author: "Diana",
      title: "Resep masakan mudah untuk ibu sibuk",
      content: "Berikut adalah beberapa resep masakan yang mudah dan cepat untuk ibu-ibu yang sibuk. Hanya perlu waktu 30 menit untuk menyiapkannya.",
      likes: 8,
      dislikes: 1,
      comments: [],
      date: "1 Mei 2025"
    }
  ],
  istri: [
    {
      id: 1,
      author: "Rina",
      title: "Cara menjaga hubungan tetap romantis",
      content: "Setelah menikah 10 tahun, ini beberapa cara yang saya lakukan untuk menjaga hubungan tetap romantis dengan suami.",
      likes: 15,
      dislikes: 0,
      comments: [
        { id: 1, author: "Tina", content: "Terima kasih tipsnya, sangat bermanfaat!" }
      ],
      date: "3 Mei 2025"
    }
  ],
  menantu: [
    {
      id: 1,
      author: "Yuni",
      title: "Pengalaman tinggal serumah dengan mertua",
      content: "Sudah 3 tahun saya tinggal serumah dengan mertua. Ada banyak tantangan dan pembelajaran yang saya dapatkan.",
      likes: 10,
      dislikes: 2,
      comments: [],
      date: "30 April 2025"
    }
  ]
};

const Komunitas = () => {
  const [activeTab, setActiveTab] = useState("ibu");
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newComments, setNewComments] = useState<Record<string, Record<number, string>>>({
    ibu: {},
    istri: {},
    menantu: {}
  });
  
  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Judul dan isi topik harus diisi");
      return;
    }
    
    const post = {
      id: Date.now(),
      author: "Saya",
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      dislikes: 0,
      comments: [],
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    
    setPosts(prev => ({
      ...prev,
      [activeTab]: [post, ...prev[activeTab as keyof typeof prev]]
    }));
    
    setNewPost({ title: "", content: "" });
    toast.success("Topik berhasil dibuat");
  };
  
  const handleLike = (postId: number) => {
    setPosts(prev => {
      const updatedPosts = {...prev};
      const categoryPosts = [...updatedPosts[activeTab as keyof typeof updatedPosts]];
      const postIndex = categoryPosts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        categoryPosts[postIndex] = {
          ...categoryPosts[postIndex],
          likes: categoryPosts[postIndex].likes + 1
        };
      }
      
      updatedPosts[activeTab as keyof typeof updatedPosts] = categoryPosts;
      return updatedPosts;
    });
  };
  
  const handleDislike = (postId: number) => {
    setPosts(prev => {
      const updatedPosts = {...prev};
      const categoryPosts = [...updatedPosts[activeTab as keyof typeof updatedPosts]];
      const postIndex = categoryPosts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        categoryPosts[postIndex] = {
          ...categoryPosts[postIndex],
          dislikes: categoryPosts[postIndex].dislikes + 1
        };
      }
      
      updatedPosts[activeTab as keyof typeof updatedPosts] = categoryPosts;
      return updatedPosts;
    });
  };
  
  const handleAddComment = (postId: number) => {
    const commentText = newComments[activeTab][postId];
    if (!commentText || !commentText.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }
    
    setPosts(prev => {
      const updatedPosts = {...prev};
      const categoryPosts = [...updatedPosts[activeTab as keyof typeof updatedPosts]];
      const postIndex = categoryPosts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        const newComment = {
          id: Date.now(),
          author: "Saya",
          content: commentText
        };
        
        categoryPosts[postIndex] = {
          ...categoryPosts[postIndex],
          comments: [...categoryPosts[postIndex].comments, newComment]
        };
      }
      
      updatedPosts[activeTab as keyof typeof updatedPosts] = categoryPosts;
      return updatedPosts;
    });
    
    setNewComments(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [postId]: ""
      }
    }));
  };
  
  const handleCommentChange = (postId: number, value: string) => {
    setNewComments(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [postId]: value
      }
    }));
  };
  
  return (
    <MainLayout title="Komunitas">
      <Tabs defaultValue="ibu" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="ibu">Ibu</TabsTrigger>
          <TabsTrigger value="istri">Istri</TabsTrigger>
          <TabsTrigger value="menantu">Menantu</TabsTrigger>
        </TabsList>
        
        {Object.keys(posts).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Buat Topik Baru</h3>
                <Input 
                  placeholder="Judul topik"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <Textarea 
                  placeholder="Isi topik..."
                  className="min-h-24"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
                <div className="flex justify-end">
                  <Button onClick={handleCreatePost}>Buat Topik</Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {posts[category as keyof typeof posts].map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Post header */}
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{post.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <User size={14} className="mr-1" />
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className="flex items-center text-sm text-gray-500 hover:text-green-600"
                          >
                            <ThumbsUp size={14} className="mr-1" />
                            <span>{post.likes}</span>
                          </button>
                          <button 
                            onClick={() => handleDislike(post.id)}
                            className="flex items-center text-sm text-gray-500 hover:text-red-600"
                          >
                            <ThumbsDown size={14} className="mr-1" />
                            <span>{post.dislikes}</span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-3">{post.content}</p>
                    </div>
                    
                    {/* Comments */}
                    <div className="bg-gray-50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={16} />
                        <span className="font-medium">
                          {post.comments.length} Komentar
                        </span>
                      </div>
                      
                      {post.comments.map(comment => (
                        <div key={comment.id} className="mb-3 pl-4 border-l-2 border-gray-200">
                          <div className="text-sm font-medium">{comment.author}</div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      ))}
                      
                      {/* Add comment */}
                      <div className="flex gap-2 mt-3">
                        <Input 
                          placeholder="Tulis komentar..."
                          className="flex-1"
                          value={newComments[activeTab][post.id] || ""}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAddComment(post.id)}
                        >
                          <Send size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {posts[category as keyof typeof posts].length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Belum ada topik. Jadilah yang pertama membuat topik!
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </MainLayout>
  );
};

export default Komunitas;
