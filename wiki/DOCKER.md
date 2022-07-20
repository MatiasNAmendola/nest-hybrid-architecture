# Docker

## Commands

### Build and run

```shell
docker build -t nest-cloud-run .
docker images
dive nest-cloud-run
docker run -p6000:5000 nest-cloud-run
```

### Stop container

```shell
docker ps
docker stop <Container_ID>
docker ps -a
```

### Delete container

```shell
docker ps -a
docker rm <Container_ID>
```

### Delete image

```shell
docker images
docker rmi <Image_ID>
docker rmi $(docker images | tail -n +2 | awk '$1 == "<none>" {print $'3'}')
```

## Sources

- [How to write a NestJS Dockerfile optimized for production](https://www.tomray.dev/nestjs-docker-production)
- [Dive](https://github.com/wagoodman/dive)
