.PHONY: build deploy compose push deploy-service port-forward rebuild deploy-k8s delete-deployment push-to-gcp

IMAGE_NAME=llm-api
OPENSHIFT_REGISTRY=default-route-openshift-image-registry.apps-crc.testing/oc-llm/$(IMAGE_NAME):latest
GCP_REGISTRY=asia-southeast1-docker.pkg.dev/llm-project-422913/$(IMAGE_NAME)/api:latest

build:
	docker build -t $(IMAGE_NAME) .

rebuild:
	docker build --no-cache -t $(IMAGE_NAME) .

delete-deployment:
	kubectl delete -f deployment.yaml

deploy:
	kubectl apply -f deployment.yaml --validate=false

compose:
	docker-compose up -d

push:
	docker tag $(IMAGE_NAME) $(OPENSHIFT_REGISTRY)
	docker push $(OPENSHIFT_REGISTRY)
	
push-to-gcp:
	docker tag $(IMAGE_NAME) $(GCP_REGISTRY)
	docker push $(GCP_REGISTRY)

deploy-service:
	kubectl apply -f service.yaml

port-forward:
	kubectl port-forward svc/$(IMAGE_NAME) 3001:3001

clean:
	docker rmi $(IMAGE_NAME)

deploy-k8s: rebuild push deploy deploy-service

push-gcp: clean rebuild push-to-gcp