import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PenTool,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Heart,
  Globe,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowRight,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const creator = {
    name: "Piyush Sangam",
    role: "Full-Stack Developer & Creator",
    bio: "Passionate software engineer crafting high-performance full-stack web applications, scalable backends, and sleek user experiences.",
    portfolioUrl: "https://piyushsangam.vercel.app/",
    githubUrl: "https://github.com/Piyush274",
    linkedinUrl: "https://www.linkedin.com/in/piyush-sangam-45b42034b/",
    email: "mailto:piyushsangam222@gmail.com",
    skills: ["React 19", "Node.js", "TypeScript", "Express", "MongoDB", "Tailwind CSS", "Stripe API", "Cloudinary"],
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Lightning-Fast Performance",
      description: "Built on React 19 and Vite for instant page loads, smooth client-side routing, and snappy UI responses.",
    },
    {
      icon: <PenTool className="h-6 w-6 text-primary" />,
      title: "Rich Creator Studio",
      description: "Intuitive rich-text creation with ReactQuill, real-time word counting, reading-time estimates, and image streaming.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-500" />,
      title: "Secure Authentication",
      description: "Multi-layered security with native JWT authentication, bcrypt password hashing, and Google OAuth 2.0 integration.",
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-500" />,
      title: "Scalable MERN Architecture",
      description: "Decoupled monorepo with MongoDB Atlas, Express REST APIs, and automated cascade data cleanup.",
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Community & Engagement",
      description: "Dynamic discussion threads, interactive like counters, social sharing, and real-time creator analytics.",
    },
    {
      icon: <Code2 className="h-6 w-6 text-pink-500" />,
      title: "SaaS Monetization",
      description: "Turn passion into revenue with integrated Stripe subscription checkout workflows and webhook listeners.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[350px] w-[600px] rounded-full bg-gradient-to-tr from-primary/20 via-purple-600/20 to-pink-500/20 blur-[130px] pointer-events-none" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>About BlogVerse</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Empowering Writers. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Connecting Curious Minds.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              BlogVerse is a modern, full-stack publishing platform engineered for writers, thinkers, and innovators to share impactful ideas with a global community.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-primary">Our Mission</span>
              <h2 className="text-3xl font-bold tracking-tight">Built for creators who value craftsmanship and speed.</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe sharing knowledge should be effortless, expressive, and beautifully designed. BlogVerse bridges the gap between simple text notes and high-end digital publications with modern typography and rich multimedia.
              </p>
              <div className="pt-2 flex gap-4">
                <Link to="/articles">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-2 shadow-md">
                    Explore Articles <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="outline">Join as a Creator</Button>
                </Link>
              </div>
            </div>

            <Card className="p-8 bg-card/60 backdrop-blur-xl border border-border/70 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Community First</h3>
                    <p className="text-xs text-muted-foreground">Open and collaborative space</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 text-center">
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-3xl font-extrabold text-primary">100%</span>
                    <p className="text-xs text-muted-foreground mt-1">Full-Stack MERN</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                    <span className="text-3xl font-extrabold text-purple-600">React 19</span>
                    <p className="text-xs text-muted-foreground mt-1">Modern SPA Tech</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Platform Features Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/40">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Key Highlights</span>
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to publish and grow</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 bg-card/50 backdrop-blur-md border border-border/60 hover:border-primary/40 transition-all rounded-2xl shadow-sm">
                <div className="p-3 rounded-xl bg-muted/60 w-fit mb-4 border border-border/40">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Creator Profile Showcase */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-primary">Meet the Developer</span>
            <h2 className="text-3xl font-bold tracking-tight mt-1">Creator & Architect</h2>
          </div>

          <Card className="p-8 sm:p-10 bg-card/80 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-xl shrink-0">
                <AvatarImage src="https://github.com/Piyush274.png" alt={creator.name} />
                <AvatarFallback className="bg-gradient-to-tr from-primary to-purple-600 text-white text-3xl font-bold">
                  PS
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h3 className="text-2xl font-extrabold text-foreground">{creator.name}</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs">
                      Author & Lead Dev
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">{creator.role}</p>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed max-w-xl">
                  {creator.bio}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                  {creator.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted/80 text-muted-foreground border border-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social & Portfolio Links */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-3">
                  <Button asChild size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-1.5 shadow-md">
                    <a href={creator.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Live Portfolio
                    </a>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <a href={creator.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <a href={creator.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 text-blue-500" /> LinkedIn
                    </a>
                  </Button>

                  <Button asChild variant="ghost" size="sm" className="gap-1.5">
                    <a href={creator.email} target="_blank" rel="noopener noreferrer">
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
