insert into usuarios (nome,email,senha,tipo,cargo) values
('Administrador','admin@agende.com','123','administrador','Administrador'),
('Alison Moreira','alison@agende.com','123','aluno','Aluno'),
('Rivani Silva','rivani@agende.com','123','responsavel','Responsável'),
('Maria Júlia','maria.julia@agende.com','123','profissional','Professor(a)'),
('João Pedro','joao@agende.com','123','profissional','Coordenador(a)'),
('Ana Souza','ana@agende.com','123','profissional','Diretor(a)')
on conflict (email) do nothing;

insert into profissionais (usuario_id, especialidade, sala, horario_inicio, horario_fim)
select id, 'Atendimento escolar', 'Sala 05', '08:00', '17:00' from usuarios where email='maria.julia@agende.com'
and not exists (select 1 from profissionais p join usuarios u on u.id=p.usuario_id where u.email='maria.julia@agende.com');

insert into profissionais (usuario_id, especialidade, sala, horario_inicio, horario_fim)
select id, 'Coordenação', 'Sala 02', '08:00', '17:00' from usuarios where email='joao@agende.com'
and not exists (select 1 from profissionais p join usuarios u on u.id=p.usuario_id where u.email='joao@agende.com');

insert into profissionais (usuario_id, especialidade, sala, horario_inicio, horario_fim)
select id, 'Direção', 'Sala 01', '08:00', '17:00' from usuarios where email='ana@agende.com'
and not exists (select 1 from profissionais p join usuarios u on u.id=p.usuario_id where u.email='ana@agende.com');

insert into alunos (nome,turma,serie,usuario_id,responsavel_id)
select 'Alison Moreira','3º Ano A','Ensino Médio',al.id,resp.id
from usuarios al, usuarios resp
where al.email='alison@agende.com' and resp.email='rivani@agende.com'
and not exists (select 1 from alunos where usuario_id=al.id);

insert into disponibilidade (profissional_id,dia_semana,hora_inicio,hora_fim)
select p.id, v.dia, v.inicio::time, v.fim::time
from profissionais p
cross join (values (1,'09:00','10:00'),(3,'09:00','10:00'),(5,'09:00','10:00'),(1,'10:00','11:00'),(3,'10:00','11:00'),(5,'10:00','11:00'),(1,'14:00','15:00'),(3,'14:00','15:00'),(5,'14:00','15:00')) v(dia,inicio,fim)
where p.usuario_id=(select id from usuarios where email='maria.julia@agende.com')
and not exists (select 1 from disponibilidade d where d.profissional_id=p.id);

insert into disponibilidade (profissional_id,dia_semana,hora_inicio,hora_fim)
select p.id, v.dia, v.inicio::time, v.fim::time
from profissionais p
cross join (values (2,'08:00','09:00'),(4,'08:00','09:00'),(2,'11:00','12:00'),(4,'11:00','12:00'),(2,'15:00','16:00'),(4,'15:00','16:00')) v(dia,inicio,fim)
where p.usuario_id=(select id from usuarios where email='joao@agende.com')
and not exists (select 1 from disponibilidade d where d.profissional_id=p.id);
