# Hire Management App

Bu uygulamanın amacı iş başvurularının  alınıp uygulama panelinde ai agent aracılığıyla incelenmesi onaylanıp,reddedilmesine karar verilmesi ve personellere eklenip eklenmemesine karar verilmesini 
sağlayan iş mantığını ve arayüzü sağlamaktır.

Şu ana kadar frontend işlemleri,backend de job servisi,management(bildirim ve yönetim) servisi,staff(personel) servisi ve auth servisi yapılmıştır. Kafka entegrasyonu sağlanmıştır. 

Geriye ai agent ile entegre olarak iş başvurularının değerlendirilmesi özellikleri ve redis,bullmq ile cache işlemleri,cdn ile statik içerik sunumu hızlandırma en son load balancer ile dockerize edilmiş
instanceler arası dağıtımın sağlanması özellikleri kalmıştır ve eklenecektir.
