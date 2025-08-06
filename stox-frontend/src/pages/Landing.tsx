import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthState } from "@/contexts/AuthContext";
import FloatingCube from "@/components/floating-cube";
import { FileUpload } from "@/components/ui/file-upload";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { PinContainer } from "@/components/ui/3d-pin";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { cn } from "@/lib/utils";

const Landing = () => {
  const { isAuthenticated } = useAuthState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Stox" className="h-12 w-auto" />
              <span className="text-xl font-gotham-black">stox</span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                // Show dashboard access for authenticated users
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                // Show authentication options for unauthenticated users
                <>
                  <Link to="/auth">
                    <Button variant="ghost">
                      <LogIn className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                      Hemen Başla
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Yapay Zeka Destekli Pazaryeriniz
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Tek tıkla{" "}
                  </span>
                    Her Yerden Satış Yapın!
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                Bir fotoğraf yükleyin; yapay zeka mükemmelleştirip SEO uyumlu metinler oluştursun, ardından anında Amazon, Trendyol ve Hepsiburada'da yayınlasın. E-ticaretin geleceği, satış için tasarlandı!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products/new">
                                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto" size="xl">
                    Hemen Satışa Başla!
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Panele Git!
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">90</div>
                  <div className="text-sm text-muted-foreground">Saniyede</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Pazaryerinde</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Otomatik</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary/20 rounded-3xl blur-3xl"></div>
              <FloatingCube />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative">
        {/* Arrows SVG Background */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <img
            src="/arrows.svg"
            alt="Decorative Arrows"
            className="w-full h-full object-contain"
            style={{ filter: 'brightness(0) saturate(100%)', transform: 'scale(0.7)', opacity: 1, color: "black", position: "absolute", top: -135, left: 0, zIndex: 100 }}
          />
        </div>
        
        {/* Dot Background Pattern */}
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          )}
        />
        {/* Radial gradient for faded look */}
        <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <FileUpload />
        </div>
          <div className="flex flex-col md:flex-row gap-20 justify-center items-center">
            <div className="flex flex-col items-center justify-center">
            <CardContainer className="inter-var justify-center items-center h-100% ">
              <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[24rem] h-auto rounded-xl p-4 border  ">
              <CardItem
                  translateZ="100"
                  rotateX={20}
                  rotateZ={-10}
                  className="w-full mt-4"
                >
                  <img src="/after.png" alt="After" />
                </CardItem>
                <CardItem
                  translateZ="50"
                  className={cn("text-xl font-gotham-black leading-tight text-black")}
                >
                  <TextGenerateEffect words="Yapay zeka basliklarinizi otomatik olarak olusturur." />
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm"
                >
                  <TextGenerateEffect words="Başlığa uygun, seo optimizasyonu yapılmış yapay zeka tarafından otomatik oluşturulmuş açıklamalar sizler icin hazırlanır." />
                </CardItem>

                <div className="flex justify-between items-center mt-12">
                  <CardItem
                    translateZ={20}
                    translateX={-40}
                    as="button"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Hemen Deneyin! →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    translateX={40}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Üye Ol!
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mt-10 mx-auto relative z-20 bg-white dark:bg-black py-10 rounded-3xl">
            <PinContainer
              title="Amazon"
              href="https://www.amazon.com/"
              containerClassName="mx-auto"
              className="w-[22rem] h-[34rem]"
            >
              <BackgroundGradient className="rounded-3xl overflow-hidden w-full">
                <div className="flex flex-col gap-4 p-6 w-full">
                  <img
                    src="/after.png"
                    alt="Air Jordan 4 Retro Reimagined"
                    className="w-full h-auto rounded-xl object-contain"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-gotham-black leading-tight text-black">
                    Nike Air Jordan 3 Retro 'Fire Red' (2022) | Beyaz/Kırmızı | CT8532-160
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    Michael Jordan'ın 1988'de giydiği efsanevi Air Jordan 3 'Fire Red' modeli. Koleksiyonluk 2022 versiyonu, topuktaki orijinal "Nike Air" logosuyla sunulmaktadır.
                    <br />
                    <br />
                    %100 Orijinal: Amazon güvencesiyle, orijinal kutusunda gönderilir.
                    <br />
                    İkonik Tasarım: Eskitme görünümlü beyaz deri ve meşhur fil deseni.
                    <br />
                    Konfor: Topuktaki görünür Air-Sole birimi ile üstün yastıklama.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button size="sm" className="px-4 py-2 bg-orange-600 hover:bg-orange-700">
                    Hemen Satışa Başla!
                    </Button>
                    <span className="rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium text-white">
                    12,499 TL
                    </span>
                  </div>
                </div>
              </BackgroundGradient>
            </PinContainer>

            <PinContainer
              title="Hepsiburada"
              href="https://www.hepsiburada.com/"
              containerClassName="mx-auto"
              className="w-[22rem] h-[34rem]"
            >
              <BackgroundGradient className="rounded-3xl overflow-hidden w-full">
                <div className="flex flex-col gap-4 p-6 w-full">
                  <img
                    src="/after.png"
                    alt="Air Jordan 4 Retro Reimagined"
                    className="w-full h-auto rounded-xl object-contain"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-gotham-black leading-tight text-black">
                    Nike Air Jordan 3 Retro 'Fire Red' OG Sneaker | %100 Orijinal, Kutulu
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug max-w-sm">
                    Tüm zamanların klasiği Air Jordan 3 'Fire Red' ile tanışın. %100 orijinal, adınıza faturalı ve açılmamış kutusunda, Hızlı Kargo avantajıyla gönderilir. Hem günlük stil hem de koleksiyon için mükemmel olan bu efsanevi modeli kaçırmayın.
                    <br />
                    <br />
                    Garanti: %100 Orijinallik Garantisi
                    <br />
                    Kargo: Hızlı Kargo avantajıyla ertesi gün teslimat imkanı (bölgeye göre değişebilir)
                    <br />
                    Malzeme: Gerçek Deri ve Kauçuk Taban
                    <br />
                    Kullanım: Günlük, Spor, Koleksiyon
                    <br />
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button size="sm" className="px-4 py-2 bg-orange-600 hover:bg-orange-700">
                    Hemen Satışa Başla! 
                    </Button>
                    <span className="rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium text-white">
                    11,999 TL
                    </span>
                  </div>
                </div>
              </BackgroundGradient>
            </PinContainer>

            <PinContainer
              title="Trendyol"
              href="https://www.trendyol.com/"
              containerClassName="mx-auto"
              className="w-[22rem] h-[34rem]"
            >
              <BackgroundGradient className="rounded-3xl overflow-hidden w-full">
                <div className="flex flex-col gap-4 p-6 w-full">
                  <img
                    src="/after.png"
                    alt="Air Jordan 4 Retro Reimagined"
                    className="w-full h-auto rounded-xl object-contain"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-gotham-black leading-tight text-black">
                    Air Jordan 3 Retro 'Fire Red' Efsane Renk Grubu Koleksiyonluk Sneaker
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    Sokak modasının yönünü belirleyen, Michael Jordan mirasının en değerli parçalarından Air Jordan 3 'Fire Red' ile tarzını bir üst seviyeye taşı! 🔥
                    <br />
                    <br />
                    Bu sadece bir ayakkabı değil, bir stil beyanı. 1988'in ruhunu günümüze taşıyan bu ikonik tasarım, şimdi orijinaline en sadık haliyle yeniden karşımızda. Topuktaki nostaljik "Nike Air" logosu, kusursuz "Fire Red" dokunuşları ve asla eskimeyen fil deseni ile tüm gözler üzerinde olacak.
                    <br />
                    <br />
                    #AirJordan #Sneakerhead #SokakModası #Jordan3
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button size="sm" className="px-4 py-2 bg-orange-600 hover:bg-orange-700">
                    Hemen Satışa Başla!
                    </Button>
                    <span className="rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium text-white">
                    12,999 TL
                    </span>
                  </div>
                </div>
              </BackgroundGradient>
            </PinContainer>
          </div>
      </section>
      
      <section className="relative bg-white dark:bg-black py-20">
        <div className="container mx-auto px-6">
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t bg-white dark:bg-black mt-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
            Satışta devrim yapmaya hazır mısınız?
            </h2>
            <p className="text-xl text-muted-foreground">
            Akıllı satışa çoktan geçiş yapan binlerce satıcıya katılın.
            </p>
            <Link to="/products/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-5" size="xl">
              Ücretsiz İlanını Oluştur!
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-white dark:bg-black">
        <div className="container mx-auto px-6">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Stox" className="h-8 w-auto" />
                <span className="font-gotham-black">stox</span>
              </div>
            <div className="text-sm text-muted-foreground">
              © 2025 <span className="font-gotham-black">stox</span>. E-ticaretin geleceği.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;