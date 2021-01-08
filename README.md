# cards_against_seriousness

Vor dem Starten mit npm müssen die Dependencies mit `npm i` installiert werden.
Dann müssen die Zertifikate mit `npm run initCerts` generiert werden. 
Dann kann per `npm run start` oder alternativ direkt `docker-compose -d up` der Server gestartet werden.
Der Client ist in den Container gemounted, damit da auch was ausgespielt werden kann muss im Client wenigstens ein Mal `npx webpack` ausgeführt werden.
