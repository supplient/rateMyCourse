# -*- coding: UTF-8 -*-
import datetime

from django.db import models


# Create your models here.

class Department(models.Model):
    """
    Description of departments. \n
    name: char, length = 64, the name of department \n
    website: URL, the (introduction) website of the department \n
    """
    name = models.CharField(max_length=64)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name

    def ret(self):
        return {
            'name': self.name,
            'website': self.website
        }


class Teacher(models.Model):
    """
    Description of teachers. \n
    name: char, length = 64, the name of teacher \n
    website: URL, the (introduction) website of the teacher \n
    title: char, length = 64, the title of the teacher \n
    //department: foreign key to table DEPARTMENT, defines which department that the teacher belongs to
    """
    name = models.CharField(max_length=64)
    website = models.URLField(blank=True)
    title = models.CharField(max_length=64, blank=True)

    '''# connections
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
    )'''

    def __str__(self):
        return self.name

    def ret(self):
        return {
            'name': self.name,
            'website': self.website,
            'title': self.title
        }


class User(models.Model):
    """
    Table of users. \n
    username: char, length = 64, the login name. must be unique \n
    mail: char, length = 64, the email address. must be unique \n
    password: char, length = 64, password, saved by md5+salt \n
    role: tuple, selected from T, S or O, representing the role of the user \n
    gender: tuple, selected from M, F or A, representing the gender of the user \n
    self_introduction: char, length = 256, the self introduction of the user, can be blank \n
    """
    ROLE_CHOICE = (
        ('T', 'Teacher'),
        ('S', 'Student'),
        ('O', 'Other'),
    )
    GENDER_CHOICE = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('A', 'Anonymous'),
    )

    # attributes
    username = models.CharField(max_length=64, unique=True)  # 用户名不可重复
    mail = models.EmailField(max_length=64, unique=True)
    profile_photo = models.URLField(blank=True, default="https://i.loli.net/2019/05/14/5cda6706c2f0861301.jpg")
    # TODO md5+salt
    password = models.CharField(max_length=32)
    role = models.CharField(max_length=1, choices=ROLE_CHOICE, default='O')
    self_introduction = models.CharField(max_length=256, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICE, default='A')

    def __str__(self):
        return self.username

    def ret(self):
        return {
            'username': self.username,
            'mail': self.mail,
            'role': self.role,
            'gender': self.gender,
            'self_introduction': self.self_introduction
        }


class Course(models.Model):
    """
    Table of users. \n
    name: char, length = 64, the name of the course \n
    website: URL, the (introduction) website of the course \n
    course_ID: char, length = 50, unique ID of the class, primary key \n
    description: char, length = 512, the description of the class, including time, place and so on \n
    # average_rank: float, the average rank of the class \n
    course_type: the type of the course \n
    credit: float, the credit of a course
    """
    '''# todo mo detailed course type
    COURSE_TYPE_CHOICE = (
        ('C', 'Compulsory '),
        ('S', 'Selective'),
        ('G', 'General'),
    )'''

    # attributes
    name = models.CharField(max_length=64)
    website = models.URLField(blank=True)
    course_ID = models.CharField(max_length=50, unique=True, null=True)
    description = models.CharField(max_length=512, blank=True)
    # average_rank = models.FloatField()
    course_type = models.CharField(max_length=64, blank=True)
    credit = models.FloatField()

    def __str__(self):
        return self.name

    def ret(self):
        return {
            'name': self.name,
            'website': self.website,
            'course_ID': self.course_ID,
            'description': self.description,
            'course_type': self.course_type,
            'credit': self.credit
        }


class TeachCourse(models.Model):
    """
    matches courses and their teachers together.\n
    teacher: ManyToManyField to table TEACHER, defines who teaches the course \n
    course: foreign key to table COURSE, defines the course \n
    department: foreign key to table DEPARTMENT, defines which department that this course belongs to \n
    """
    teachers = models.ManyToManyField(
        Teacher,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
    )


class SelectCourse(models.Model):
    """
    matches courses and their teachers together.\n
    User: ManyToManyField to table USER, defines who select the course \n
    course: foreign key to table COURSE, defines the course \n
    department: foreign key to table DEPARTMENT, defines which department that this course belongs to \n
    """
    user = models.ManyToManyField(
        User,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
    )


class Rank(models.Model):
    """
    rank records. \n
    difficulty_score: difficulty of the course \n
    funny_score: how fun the course is \n
    gain_score: how much do you gain from the course \n
    recommend_score: the possibility of recommending the course to others \n
    edit_time: when the score is given\n
    """
    difficulty_score = models.FloatField(default=0)
    funny_score = models.FloatField(default=0)
    gain_score = models.FloatField(default=0)
    recommend_score = models.FloatField(default=0)
    edit_time = models.DateTimeField(auto_now=True)

    def ret(self):
        return {
            'difficulty_score': self.difficulty_score,
            'funny_score': self.funny_score,
            'gain_score': self.gain_score,
            'recommend_score': self.recommend_score,
            'edit_time': str(self.edit_time)
        }


class MakeRank(models.Model):
    """
    match student with their courses. \n
    user: foreign key to table USER, defines who selects the course \n
    course: foreign key to table COURSE, defines which course that is selected \n
    ranks: foreign key to table RANKS, the detail of rank \n
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    rank = models.ForeignKey(
        Rank,
        on_delete=models.CASCADE,
    )


class RankCache(models.Model):
    """
    课程排名缓存，
    保存课程的排名，四项评分，评分人数等。
    为进入排名序列的课程排名取-1
    """
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    count = models.IntegerField(default=0)
    difficulty_score = models.FloatField(default=0)
    funny_score = models.FloatField(default=0)
    gain_score = models.FloatField(default=0)
    recommend_score = models.FloatField(default=0)
    position = models.FloatField(default=-1)
    people = models.IntegerField(default=0)


class TeacherRankCache(models.Model):
    """
    教师排名缓存，
    保存教师的排名，四项评分，评分人数等。
    为进入排名序列的教师排名取-1
    """
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
    )
    count = models.IntegerField(default=0)
    difficulty_score = models.FloatField(default=0)
    funny_score = models.FloatField(default=0)
    gain_score = models.FloatField(default=0)
    recommend_score = models.FloatField(default=0)
    position = models.FloatField(default=-1)
    people = models.IntegerField(default=0)


class Comment(models.Model):
    """
    details of each comment. \n
    content: char, length = 48. The main content of a comment \n
    create_time: DateTime, the time of create \n
    edit_time: Datetime, the time of last edit \n
    parent_comment: int, the id of it parent comment, default = -1 \n
    """
    content = models.CharField(max_length=2048)
    create_time = models.DateTimeField(default=datetime.datetime.now)
    edit_time = models.DateTimeField(auto_now=True)
    parent_comment = models.IntegerField(default=-1)
    rate = models.IntegerField(default=0)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        default=None,
    )

    def ret(self):
        return {
            'content': self.content,
            'create_time': str(
                (self.create_time +
                 datetime.timedelta(
                     seconds=8 *
                             60 *
                             60)).strftime("%Y-%m-%d %H:%M")),
            'edit_time': str(
                (self.edit_time +
                 datetime.timedelta(
                     seconds=8 *
                             60 *
                             60)).strftime("%Y-%m-%d %H:%M")),
            'parent_comment': self.parent_comment,
            'teacher': str(
                self.teacher.name)}


class MakeComment(models.Model):
    """
    match comments with the users that makes them. \n
    user: foreign key to table USER, defines whom the comment is created by \n
    course: foreign key to table COURSE, defines the course that this comment belongs \n
    comment: foreign key to table COMMENT, leads to the content of comment \n
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
    )


class HitCount(models.Model):
    """
    暂未使用
    """
    name = models.CharField(max_length=50)
    count = models.BigIntegerField()

    def ret(self):
        return {
            'name': self.name,
            'count': self.count
        }


class RateComment(models.Model):
    """
    记录赞踩信息，防止重复
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
    )
    rate = models.IntegerField(default=0)


class PasswordQuestion(models.Model):
    """
    密码重置，保存安全问题及其答案。
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)
