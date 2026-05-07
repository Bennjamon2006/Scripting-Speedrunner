# Remote-Shell

En este reto, implementé una shell remota en Node.js. La shell remota es un programa que permite a los usuarios ejecutar comandos en un servidor remoto a través de conexiones HTTP.

# Características

- Permite al cliente crear una terminal remota en el servidor.
- El cliente puede enviar comandos a la terminal remota mediante solicitudes HTTP POST.
- El cliente puede recibir la salida de los comandos ejecutados en la terminal remota mediante streaming HTTP.

# Nota

Se implementó una funcionalidad básica para permitir la ejecución de comandos remotos y la recepción de sus resultados. Debido al tiempo limitado de 90 minutos, no se optimizó el código ni se manejaron casos edge, pero se logró una funcionalidad básica para demostrar la capacidad de ejecutar comandos en un servidor remoto a través de HTTP.

Este código es un ejemplo de cómo se puede tener un flujo bidireccional entre un cliente y un servidor utilizando HTTP mediante streaming, lo que permite una comunicación eficiente y en tiempo real entre ambos.
