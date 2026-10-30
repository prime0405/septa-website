import { Component, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoadingBlock } from "./components/ui/primitives";
import { Button } from "./components/ui/Button";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Cases = lazy(() => import("./pages/Cases"));
const CaseDetail = lazy(() => import("./pages/CaseDetail"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const ProductHub = lazy(() => import("./pages/ProductHub"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const Faq = lazy(() => import("./pages/Faq"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Request = lazy(() => import("./pages/Request"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="wrap section">
        <div className="card max-w-xl p-8">
          <p className="eyebrow mb-4">Something broke</p>
          <h1 className="text-2xl">This page failed to render</h1>
          <p className="prose-body mt-3 text-[0.92rem]">
            The rest of the site still works. Reloading usually clears it; if it does not, the
            detail below is enough for us to fix it.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-card border border-line bg-ink-raised p-3 font-mono text-[0.75rem] text-rose">
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => window.location.reload()} size="sm">
              Reload page
            </Button>
            <Button to="/" variant="secondary" size="sm">
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="wrap">
            <LoadingBlock label="Loading page" />
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/case-studies" element={<Cases />} />
            <Route path="/case-studies/:slug" element={<CaseDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/product-development" element={<ProductHub />} />
            <Route path="/product-development/:slug" element={<ProductDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request" element={<Request />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="/case-study" element={<Navigate to="/case-studies" replace />} />
            <Route path="/career" element={<Navigate to="/careers" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
