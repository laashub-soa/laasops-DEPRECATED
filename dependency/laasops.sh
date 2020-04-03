mkdir -p /data/tristan/laashub/laasops/distribution/configs/
mkdir -p /data/tristan/laashub/laasops/engine_logic_dir/

mv application.yml /data/tristan/laashub/laasops/distribution/configs/application.yml

docker stop laasops
docker rm laasops
docker rmi laashub/laasops

docker run -d --restart=always --name laasops -p 5000:5000 \
  -v /data/tristan/laashub/laasops/distribution/configs:/usr/src/app/distribution/configs \
  -v /data/tristan/laashub/laasops/engine_logic_dir:/usr/src/app/engine_logic_dir \
  laashub/laasops

docker logs -f --tail 100 laasops

docker exec -it laasops bash