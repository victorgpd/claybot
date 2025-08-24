self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Nova notificação!";
  const options = {
    body: data,
    // icon: "/icon.png", // opcional
    // badge: "/badge.png", // opcional
  };
  event.waitUntil(self.registration.showNotification("Claybot", options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://victorgpd.github.io/claybot/") // link ao clicar na notificação
  );
});
