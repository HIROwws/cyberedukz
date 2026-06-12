FROM alpine:3.20

RUN adduser -D student \
  && mkdir -p /home/student/training \
  && echo "Welcome to CyberEdu KZ Linux basics lab." > /home/student/training/readme.txt \
  && echo "CYB{hidden_file_found}" > /home/student/.flag \
  && chown -R student:student /home/student

USER student
WORKDIR /home/student

CMD ["/bin/sh"]

