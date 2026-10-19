# Hiring Management App

<p align="center">
<img src="https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/6da40ed7-fe7c-4a48-bdc3-71154135ffa9.png?raw=true" width="768" height="624" alt="Açıklama">
</p>

Bu Express.js ve Next.js ile tasarlanmış uygulamanın amacı iş başvurularının alınıp  AI Agent,ElasticSearch gibi yardımcı araçlarla değerlendirilip, değerlendirme pipeline i içerisinde işe alınıp alınmamasına karar verilmesi için arayüz sağlamaktır.

Bu uygulama günlük 100 bin isteği 5 bin eş zamanlı istek üst sınırıda göz önüne alındığında rahatlıkla kaldırabilecek,işleyebilecek şekilde tasarlanmıştır. Otomatik ölçenen kubernetes containerları ile yaklaşık 6 mikroservis  ve mongodb,redis,kafka,prometheus,grafana,elastic search kullanmaktadır. Bunlar sayesinde iş başvuruları isteklerinin 200 saniyede 50.000 tanesini rahatça karşılayabildiği test edilmiştir. 

Proje canlıda test edilmiştir. İstendiği durumda bana ulaşıp backendi aktif etmemi sağlayıp canlıyı test etme isteğinizi bildrebilirsiniz.

Canlı linki : https://hiringapp.ahmetkar.com/ (backendi aktif değildir aktif edilip test edilmesi için benimle iletişmie geçin) 

Not : Yakın zamanda eklenecek özellikler TODO.txt dosyasında bulunmaktadır. Yakında gerekli tüm güncellemeler yapılıp production-ready hale getirilecektir.
# Kullanılan Stack

- Express.js Backend için kullanılmıştır
- MongoDb veritabanı olarak kullanılmıştır.
- Redis caching amacıyla kullanılmıştır.
- Kafka mikroservisler arası kuyruk mesajlaşma teknolojisi olarak kullanılmıştır
- Next.js frontend için kullanılmıştır
- Prisma orm teknolojisi olarak kullanılmıştır.
- EC2 + Kubernetes deployment için kullanılmıştır.

# Kullanılan Teknolojiler

- Kafka : Kullanıcı iş başvurusu ekler kafka ile JobAppCreated olayı yayınlanır. Bunu tüketen management servisi ilgili kişiler için bildirimler oluşturur.Yönetici veya Personel onaylarsa veya redderse JobAppCreated veya JobAppDenied olayı yayımlanır bunları tüketen staff servisi yeni personel oluşturur ve management servisi ilgili kişilere bildirimler gönderir.
- Redis : Veritabanından çekilen iş başvuruları,personel,bildirimler için cache mekanizması olarak ve bullmq aracılığıyla kuyruğa eklenen iş başvurusu oluşturmma vs. gibi işlemlerde cache meknizması olarak kullanılmıştır.
- BullMQ : İş başvurusu ekleme,personel ekleme,ai servisinde tekli,çoklu prompt gönderme ve mongodb ve elastic searche prompt ve embedding bilgilerini kaydetme,elastic searche kaydedilen embeddingler üzerinden personeller ve başvurular arasında karşılaştırma yapma işlemleri bullmq ile iş kuyruklarına eklenip parelelize edilmiştir.
- ElasticSearch ile prompt ve embedding kaydı olan iş başvuruları ve personeller arası knn ile karşılaştırma yapılması sağlanmıştır. Yine ölçeklenebilir şekilde redis+bullmq ile yönetilmektedir.
- Mongodb : Tüm veriler tek mongodb containerında tutuluyor.
- Prometheus : prom-client aracılığıyla istek sayısı,istek süresi,iş başvurusu süreleri,kafka,redis,prisma bağlantı gibi metrikler,durumlar ölçülmüştür.
- Grafana : Grafana ile prometheus ile ölçülen veriler alınıp incelenmiştir.
- Frontendde tinydash teması ThemeVagon dan ücretsiz alınarak kullanılmıştır.


# Kafka Altyapısı açıklaması

Kafka Publish/Subscribe Design Pattern'ı uygulanmıştır.

- Kafkanın iş başvurusu geldiğinde ve job service de  başarıyla eklendiğinde JobAppCreated eventi yayınlaması sağlanmış management service in bu eventi consume edip Staff ve Manager rolündeki kullanıcılara bildirim göndermesi sağlanmıştır. 
- İş başvurusu job service de onaylandığında jobappapproved eventi yayımlanmış bunlar management ve staff service de consume edilmiştir. Management service de yine staff ve Manager rolündeki kullanıcılara bildirim gönderilmiş staff service de consume edilen ,onaylanan iş başvurusunun veritabanına eklenmesi sağlanmıştır.
- Reddedildiğinde management service yine staff ve manager rolündeki kullanıcılara bildirim gönderilmiştir.

# Redis Altyapısı açıklanması

- Redis Cache Aside/Lazy Loading Design Pattern
- Redis Cache Invalidation Pattern
 uygulanmıştır.

- Redis veritabanından çekilen verilerin get isteğiyle alındığı endpointlerde lazy loading pattern ile kullanılmıştır. Veri eğer rediste varsa direk redisten alınıp gönderilmiş yoksa veritabanından alınıp redise kaydedilip sonra kullanıcıya gönderilmiştir. 
- Bu eklenen veriler cache tag verilerek eklenmiştir. Bundan sonra örneğin iş başvurusu ekleme,güncelleme,silme endpointlerindede etkilenen verilerin redise hangi cache tag lar altınnda kaydedilmişse o cache taglar invalidate edilmiş böylece ilgili verilerin güncel kalması sağlanmıştır.

# Video

Uygulamanın özelliklerinin gösterildiği video aşağıdaki gibidir.

[Video için tıklayın.](https://drive.google.com/file/d/1lQ1js0N1czIKa0WGo90IjAaPIU2s2S8c/view?usp=sharing)

# Ekran Görüntüleri

## Ana Sayfa Görüntüsü

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20225331.png?raw=true)

## İş Başvuruları Ekranı

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20225414.png?raw=true)

## Yönetici veya Personel Ekranı
#
![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-31%20050304.png?raw=true)

## Yönetici veya Personel Ekranı

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-31%20050304.png?raw=true)


## Tekil iş başvurusu ekranı

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-31%20050342.png?raw=true)

## CV Karşılaştırma Sonuçları

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-31%20050419.png?raw=true)


# Altyapının Açıklanması

## Deployment için kullanılan AMAZON EC2 açıklaması

- Amazon üzerinden oluşturduğum 2 tane t3x.large türündeki EC2 sunucusunun birine tüm mikroservisleri,redisi ve kafkayı kurdum diğerinede veritabanını ve elasticsearchi kurdum.
- Her biri 16GB RAM ve 4 vCPU ve 25GB alan kullanmaktadır.

## Kubernetes altyapısı açıklaması

- EC2 sunucularını oluşturdum ve görevlerini ayırdım. AWS üzerinde Ubuntu Server 24.04 kullanan iki sanal sunucu hazırladım. hm-app-1 sunucusunu uygulama katmanı ve Kubernetes control plane için, hm-data-1 sunucusunu ise veri tabanları ve arama altyapısı için konumlandırdım.

- AWS ağ ve güvenlik kurallarını yapılandırdım. Sunucular arasındaki özel ağ iletişimini ve Kubernetes pod ağı için gerekli Flannel VXLAN trafiğini düzenledim. Düğümler arası UDP 8472 erişimini açarak Flannel bağlantı sorununu giderdim. İnternet erişiminde SSH 22, HTTP 80 ve HTTPS 443 portlarını kullanım amaçlarına göre ele aldım; MongoDB, Redis ve Kafka gibi altyapı servislerini doğrudan internete açmak yerine özel ağ üzerinden erişilecek şekilde ayarladım.

- Kubernetes kaynaklarını namespace'lere ayırdım. Uygulamalar için app, MongoDB ve Elasticsearch için data, Redis için infra, Kafka için kafka, Ingress için nginx-ingress, sertifikalar için cert-manager ve Elasticsearch operatörü için elastic-system namespace'lerini kullandım. 

- MongoDB veritabanını kurdum ve yerel yedeği geri yükledim. hm-data-1 üzerinde MongoDB Community Operator aracılığıyla MongoDB 8.0.32 kurulumunu gerçekleştirdim.  Ardından hm-mongodb replica set'ini, hm-app veritabanı kullanıcısını ve depolama kaynaklarını yapılandırdım.
  
- Redis altyapısını kurdum. Redis'i infra namespace'inde StatefulSet ve kalıcı depolama yapılandırmasıyla çalıştırdım. Mikroservislerin Redis'e Kubernetes Service üzerinden erişmesini sağladım.

  
- Kafka altyapısını Strimzi ile kurdum. Strimzi Kafka operatörünü kullanarak kafka namespace'inde hm-kafka kümesini oluşturdum. Kafka istemcilerinin broker'a kimlik doğrulamalı ve şifreli bağlantı kurabilmesi için TLS ve SCRAM-SHA-512 yapılandırmasını yaptım. hm-backend adlı Kafka kullanıcısını oluşturarak uygulamaların gerekli bağlantı kimlik bilgilerini Kubernetes Secret üzerinden kullanmasını sağladım.

- Mikroservisler arasındaki Kafka topic'lerini tanımladım. job.application.created, job.application.approved ve job.application.denied topic'leri için KafkaTopic kaynakları oluşturdum. Başlangıçta eksik topic'lerden kaynaklanan tüketici hatalarını giderdim ve ilgili mikroservisleri yeniden başlattım. Böylece iş başvurularının oluşturulması, onaylanması ve reddedilmesi gibi olayların asenkron iletişimine yönelik altyapıyı hazırladım.

- Elasticsearch ve ECK operatörünü kurdum. ECK 3.5.0 operatörünü elastic-system namespace'inde çalıştırdım. data namespace'inde Elasticsearch 9.2.8 kümesini oluşturup kalıcı depolama ve kimlik doğrulama yapılandırmalarını tamamladım. AI servisinin Elasticsearch'e TLS doğrulaması ve kimlik bilgileriyle bağlanabilmesi için uygulama tarafındaki bağlantı kodunu da düzenledim.

- Backend mikroservislerini derledim ve dağıtıma hazırladım. Nx monoreposunda bulunan auth-service, job-service, management-service, staff-service, ai-service ve api-gateway uygulamalarını Node.js 22 ortamında derledim. TypeScript kontrolleri ve build süreçlerinde karşılaştığım hataları giderdim. Ayrıca Kafka bağlantılarını TLS ve SCRAM-SHA-512 ile, AI servisinin Elasticsearch bağlantısını ise kimlik doğrulama ve CA sertifikası doğrulamasıyla çalışacak şekilde düzenledim.

- Docker imajlarını GitHub Actions ile otomatik oluşturdum. .github/workflows/backend-images.yml iş akışıyla altı backend servisinin Docker imajlarını oluşturup GitHub Container Registry'ye (GHCR) gönderen CI sürecini kullandım. İmajların Kubernetes tarafından çekilebilmesi için ghcr-pull Secret'ını hazırladım. Böylece kodun build edilmesi ve container imajlarının dağıtıma hazırlanması sürecini otomatikleştirdim.

- Backend servislerini Kubernetes'e deploy ettim. deploy/k8s/base altındaki Kustomize manifestlerini kullanarak app namespace'inde altı servis için Deployment ve Service kaynaklarını oluşturdum. Uygulamaları kendi portlarıyla çalıştırıp API Gateway'i 4000, auth-service'i 3330, job-service'i 3331, management-service'i 3332, staff-service'i 3333 ve ai-service'i 3334 portlarıyla yapılandırdım. Servisler arası iletişim için Kubernetes Service adreslerini kullandım.

- Uygulama konfigürasyonlarını ve gizli bilgileri yönettim. ConfigMap ve Secret kaynaklarını kullanarak uygulama ayarlarını, MongoDB bağlantısını, JWT anahtarlarını, iç API anahtarını, Redis bilgilerini, Kafka kimlik bilgilerini, Elasticsearch erişimini ve AI API anahtarını ayrı tuttum. deploy/k8s/base/app-config.yaml dosyasını genel konfigürasyon, deploy/k8s/base/workloads.yaml dosyasını ise uygulama iş yükleri için kullandım. Böylece hassas bilgileri uygulama koduna sabitlemek yerine Kubernetes yapılandırması üzerinden yönetilebilir hâle getirdim.

- NGINX Ingress Controller kurdum. Kubernetes'e gelen web trafiğini uygulama servislerine yönlendirmek için NGINX Ingress Controller'ı nginx-ingress namespace'inde çalıştırdım. api.ahmetkar.com host'u için api isimli Ingress kaynağını oluşturarak istekleri api-gateway servisine ve 4000 portuna yönlendirdim. Böylece backend mikroservislerini ayrı ayrı internete açmak yerine API Gateway'i dış erişim noktası olarak kullandım.

- cert-manager ile TLS sertifika yönetimini yapılandırdım. cert-manager v1.20.4 kurulumunu yaptıktan sonra letsencrypt-staging ClusterIssuer ile HTTP-01 doğrulamasını test ettim. NGINX'in HTTP isteklerini HTTPS'e yönlendirmesi nedeniyle doğrulama sorunu yaşadım; Ingress ayarlarını düzelterek staging sertifikasının oluşturulmasını sağladım. Ardından letsencrypt-prod issuer'ına geçerek üretim sertifikasını kullandım.

- DNS, HTTPS ve HTTP yönlendirmesini test ettim. api.ahmetkar.com alan adını EC2 public IP adresine bağladım. Ayrıca https://api.ahmetkar.com/api-health endpoint'inden HTTP 200 OK yanıtı aldım. Böylece API Gateway'in dışarıdan HTTPS üzerinden erişilebilir olduğunu doğruladım.

# Grafana K6 ile yük testi değerlendirilmesi

Grafana K6 oluşturduğu sanal kullanıcıları ile verilen API test kodlarını çalıştıran bir yük testi aracıdır. Aşağıda gerçekleştirdiğim 4 adet teste ait görüntüler ve açıklamalar görünmektedir.
Bu testlerde Job Application oluşturan endpointe eşzamanlı istekler gönderilmiş 10bin,20bin ve 50 bin istek kümeleri tamamen başarılı olmuştur.

## Test Kodu Örneği

Aşağıda test kodu örneği görülmektedir. Bu load testinin ayarlarının oluşturulduğu kısmıdır.
2 saniyelik time unitte 800 istek gönderilmiş 200 s içinde 80.000 istek gönderilmiştir.
Sonuçlarla ilgili metriklerin berirlediği threholds kısmında ilk şartın failed sayılması için toplam request başarısı miktarının %20 den az olması koşulu konulmuştur.
Ayrıca tüm isteklerin ortalama 1 er sn den az bitmesi,isteklerinin %95 inin 2 şer sn den az bitmesi,%99 unun 5 şer sn den az bitmesi şartı konulmuştur.
Test için ayarlanan VU(Virtual User) minimum 2000  ve maximum 3500 olacak şekilde ayarlanmıştır.
Bu testi çalıştırmak içinde t3.xlarge türünde Amazon EC2 sunucusu kullanılmıştır.
Bu kod en son yapılmış olan stres testine aittir.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20200626.png?raw=true)


## 1.Test 


### Test Sonuçları

1.Testte saniyede 50 sanal kullanıcının aynı anda istek göndermesi ve 200 saniye içinde toplam 10 bin istek atılması sağlanmıştır ve hepsi başarılı dönmüştür. 

Threshoolds kısmında avg ile isteklerin ortalama dönüş süresini görüyoruz. İsteklerin %99 u 35 milisaniyeden az yüzde 95 die 16 ms den az sürede dönmüştür.
http_reqs kısmında istek sayısı k6 grafanada kullanılan vus sayısı ile sanal kullanıcı sayısı

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20184803.png?raw=true)


### Cpu Kullanımı : 

Görüldüğü gibi yerel saat ile 18:45 te 10k istekte serverin cpu kullanımı sadece %21 olmuştur. 

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20185119.png?raw=true)


## 2.Test

### Test Sonuçları

2.Testte saniyede 100 sanal kullanıcının aynı anda istek göndermesi ve 200 saniye içinde toplam 20 bin istek atılması sağlanmıştır ve hepsi başarılı dönmüştür. 
İsteklerin %99 u 45 milisaniyeden az yüzde 95 i ise 22 ms den az sürede dönmüştür.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20190349.png?raw=true)


### Cpu Kullanımı : 

Görüldüğü gibi yerel saat ile 19:00 da 20k istekte serverin cpu kullanımı sadece %32 olmuştur. 

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20190613.png?raw=true)



## 3.Test

### Test Sonuçları

3.Testte saniyede 250 sanal kullanıcının aynı anda istek göndermesi ve 200 saniye içinde toplam 50 bin istek atılması sağlanmıştır ve hepsi başarılı dönmüştür. 
İsteklerin %99 u 65 milisaniyeden az yüzde 95 i ise 36 ms den az sürede dönmüştür.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20191508.png?raw=true)


### Cpu Kullanımı : 

Görüldüğü gibi 50k isteğin yapıldığı UTC ile 16:10 da serverin cpu kullanımı sadece %42 olmuştur. 

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20191628.png?raw=true)



# Prometheus ve Grafana ile Ölçüm Sonuçları Değerlendirilmesi

Prometheus ile toplanan ve grafana ile alınan veriler aşağıdaki gibidir.

## İş başvurusunun gönderilme,worker kuyruğunda işlenme ve kullanıcıya cevap döndürülme hızı


Grafikte görüldüğü gibi iş başvurusunun kullanıcı tarafından gönderilmesi,redis bullmq tarafıdan kuyruğa eklenip veritabanı işlemlerinin yapılıp cevabın dönmesi 22 ms ve 100ms aralığı dönüş hızları çoğunluktadır. İşlem başına ortalama latency 22 ms-100ms aralığındadır. Bu iş başvurusu ve onaylama gibi işlemler çok kısa bir sürede halledildiği, saniyeler içinde onbinlerce iş başvurusu işlenebildiği anlamına gelmektedir.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20202621.png?raw=true)


## Veritabanına eklenen toplam iş başvurusu sayısı (80k başarılı istek olduğu göz önüne alınırsa)

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20212748.png?raw=true)




