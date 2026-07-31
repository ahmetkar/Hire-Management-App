# Hiring Management App

Bu express.js ve next.js ile oluşuturulmuş uygulamanın amacı iş başvurularının  alınıp uygulama panelinde ai agent aracılığıyla incelenmesi onaylanıp,reddedilmesine karar verilmesi ve personellere eklenip eklenmemesine karar verilmesini 
sağlayan iş mantığını ve arayüzü sağlamaktır. Bu uygulama orta ölçekli olması planlanarak programlanmıştır. Otomatik ölçenen kubernetes containerları ile yaklaşık 6 mikroservis  ve mongodb,redis,kafka,prometheus,grafana,elastic search kullanmaktadır. Bunlar sayesinde iş başvuruları isteklerinin 200 saniyede 50.000 tanesini rahatça karşılayabildiği test edilmiştir. 

# Kullanılan Stack

- Express.js Backend için kullanılmıştır
- MongoDb veritabanı olarak Redis cache veritabanı olarak kullanılmıştır.
- Kafka mikroservisler arası haberleşme için kullanılmıştır
- Next.js frontend için kullanılmıştır
- Prisma orm teknolojisi olarak kullanılmıştır.
- EC2 + Kubernetes deployment için kullanılmıştır.

# Kullanılan Teknolojiler

- Kafka : Kullanıcı iş başvurusu ekler kafka ile JobAppCreated olayı yayınlanır. Bunu tüketen management servisi ilgili kişiler için bildirimler oluşturur.Yönetici veya Personel onaylarsa veya redderse JobAppCreated veya JobAppDenied olayı yayımlanır bunları tüketen staff servisi yeni personel oluşturur ve management servisi ilgili kişilere bildirimler gönderir.
- Redis : Veritabanından çekilen iş başvuruları,personel,bildirimler için cache mekanizması olarak ve bullmq aracılığıyla kuyruğa eklenen iş başvurusu oluşturmma vs. gibi işlemlerde cache meknizması olarak kullanılmıştır.
- BullMQ : İş başvurusu ekleme,personel ekleme,ai servisinde tekli,çoklu prompt gönderme ve mongodb ve elastic searche prompt ve embedding bilgilerini kaydetme,elastic searche kaydedilen embeddingler üzerinden personeller ve başvurular arasında karşılaştırma yapma işlemleri bullmq ile iş kuyruklarına eklenip parelelize edilmiştir.
- ElasticSearch ile prompt ve embedding kaydı olan iş başvuruları ve personeller arası knn ile karşılaştırma yapılması sağlanmıştır. Yine ölçeklenebilir şekilde redis+bullmq ile yönetilmektedir.
- Mongodb : Tüm veriler tek mongodb containerında tutuluyor.
- Prometheus : prom-client aracılığıyla istek sayısı,istek süresi,iş başvurusu süreleri,kafka,redis,prisma bağlantı durumları ölçülmüştür.
- Grafana : Grafana ile prometheusun ölçtüğü veriler alınıp incelenmiştir.
- Frontendde tinydash teması themevagondan ücretsiz alınarak kullanılmıştır. 

# Video

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



# Grafana K6 ile yük testi değerlendirilmesi

Grafana K6 oluşturduğu sanal kullanıcılarla verilen api istek kodlarını çalıştıran bir yük testi aracıdır. Aşağıda 4 tane teste ait görüntüler ve açıklamalarr görünmektedir.
Bu testlerde job application create api endpointine eşzamanlı istekler gönderilmiş 10bin,20bin ve 50 bin istek kümeleri tamamen başarılı olmuştur. Bunlar sistemin berirli aralıklarla
birkaç dakika içinde 100 bin  isteğe dayanıklı olduğunu göstermektedir.


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


## 4.Test (Stres Testi) 

### Test Sonuçları

4.Testte sınırlar zorlanıp saniyede 400 sanal kullanıcının aynı anda istek göndermesi ve 200 saniye içinde toplam 80 bin istek atılması sağlanmıştır. Sistem dayananamış sadece
küçük bir kısmı çökmüştür. Buda sistemin sınırlarını berirleyen eşik noktası olmuştur.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20200544.png?raw=true)


### Cpu Kullanımı : 
Sistem ekstra 80k isteğe dayanamaz hale geldiği için çünkü bundan önce zaten 10+20+50 yani toplam 80k istek gönderilmiştir.Server çökmemiş yine azda olsa bir kısmını işleyebilir halde
kalmıştır.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20200731.png?raw=true)




# Prometheus ve Grafana ile Ölçüm Sonuçları Değerlendirilmesi

Prometheus ile toplanan ve grafana ile alınan veriler aşağıdaki gibidir.

## İş başvurusunun gönderilme,worker kuyruğunda işlenme ve kullanıcıya cevap döndürülme hızı


Grafikte görüldüğü gibi 22 ms ve 1s aralığı dönüş hızları çoğunluktadır.

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20202621.png?raw=true)

## Saniye saniye bitirilen iş başvurusu sayısı

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20203128.png?raw=true)

## Veritabanına eklenen toplam iş başvurusu sayısı (80k başarılı istek olduğu göz önüne alınırsa)

![](https://github.com/ahmetkar/Hire-Management-App/blob/main/screenshoots/Screenshot%202026-07-30%20212748.png?raw=true)




