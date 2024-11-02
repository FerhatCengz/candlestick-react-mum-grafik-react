# React Trading Charts

Bu proje, React ve Lightweight Charts kullanarak gerçek zamanlı ve statik ticaret grafikleri oluşturan bir uygulamadır. Proje, Binance API'sinden gerçek zamanlı verileri alarak grafikleri günceller ve ayrıca rastgele veri üreten statik grafikler içerir.

## Proje Yapısı

### Önemli Dosyalar ve Klasörler

- **src/**: Uygulamanın ana kaynak kodlarını içerir.
  - **App.tsx**: Uygulamanın ana bileşeni.
  - **Binance.tsx**: Binance API'sinden gerçek zamanlı verileri alarak grafik oluşturan bileşen.
  - **RealTime.tsx**: Rastgele veri üreten ve gerçek zamanlı olarak güncellenen grafik bileşeni.
  - **StaticTime.tsx**: Rastgele veri üreten ve statik olarak gösterilen grafik bileşeni.
  - **main.tsx**: React uygulamasının giriş noktası.
- **index.html**: Uygulamanın HTML şablonu.
- **package.json**: Proje bağımlılıklarını ve script'lerini tanımlar.
- **vite.config.ts**: Vite yapılandırma dosyası.
- **tsconfig.json**: TypeScript yapılandırma dosyası.

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:

   ```sh
   git clone https://github.com/kullanici-adi/react-trading.git
   cd react-trading





   ```

   İşte düzenlenmiş README dosyası:

---

Bu proje, statik, gerçek zamanlı ve Binance API'sinden alınan verilere dayalı olarak çeşitli mum grafik bileşenleri sunmaktadır.

## Kullanım

### Statik Grafik

`StaticTime.tsx` dosyasında, rastgele veri üreten ve statik olarak gösterilen bir grafik bileşeni bulunmaktadır. Bu bileşen, belirli bir zaman aralığında rastgele oluşturulan verilerle bir mum grafiği oluşturmaktadır.

### Gerçek Zamanlı Grafik

`RealTime.tsx` dosyasında, rastgele veri üreten ve gerçek zamanlı olarak güncellenen bir grafik bileşeni bulunmaktadır. Bu bileşen, belirli bir zaman aralığında rastgele oluşturulan verilerle bir mum grafiği oluşturur ve belirli aralıklarla güncellenir.

### Binance Gerçek Zamanlı Grafik

`Binance.tsx` dosyasında, Binance API'sinden gerçek zamanlı veriler alarak grafik oluşturan bir bileşen bulunmaktadır. Bu bileşen, WebSocket kullanarak Binance API'sinden BTC/USDT paritesinin 1 dakikalık mum verilerini alır ve grafiği sürekli olarak günceller.

## Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, lütfen bir **pull request** gönderin veya bir **issue** açın.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

---

Bu [README.md](http://_vscodecontentref_/15) dosyası, projenizin genel yapısını, kurulum ve çalıştırma adımlarını, bileşenlerin işlevlerini ve katkıda bulunma yönergelerini açıklar.
