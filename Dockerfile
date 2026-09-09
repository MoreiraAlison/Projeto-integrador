# pode mudar a depender da versão
FROM node:24

WORKDIR /app

# porta do backend (padrão express)
EXPOSE 3000
# porta do frontend (padrão vite)
EXPOSE 5173

CMD ["bash"]