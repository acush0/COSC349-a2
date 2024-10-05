package dao;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */


import domain.Flat;
import domain.Task;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.Collection;

/**
 *
 * @author haydenaish
 */

public interface TaskJdbiDAO extends TaskDAO{

    @Override
    @SqlUpdate("UPDATE task SET completed = :completed WHERE taskID = :task.taskID")
    void setCompleteTask(@BindBean("task") Task task,@Bind("completed") Boolean completed);

    @Override
    @SqlUpdate("UPDATE task SET completed = :completed WHERE taskID = :taskID")
    void setCompleteTask(@Bind("taskID") String taskID,@Bind("completed") Boolean completed);

    @Override
    @SqlUpdate("INSERT INTO task (taskID, taskName, description, flatID, requestedDate, completed) values (:taskID,:taskName, :description, :flatID, :requestedDate, :completed)")
    void createTask(@BindBean Task task);

    @Override
    @SqlUpdate("DELETE FROM task where taskID = :taskID")
    void removeTask(@BindBean Task task);
    @Override
    @SqlUpdate("DELETE FROM task where taskID = :taskID")
    void removeTask(@Bind("taskID") String taskID);

    @Override
    @SqlQuery("Select * from task where taskID = :taskID")
    @RegisterBeanMapper(Task.class)
    Task getTask(@Bind("taskID") String taskID);

    @Override
    @SqlQuery("Select * from task where flatID = :flatID")
    @RegisterBeanMapper(Task.class)
    Collection<Task> getTaskByFlat(@Bind("flatID") String flatID);

    @Override
    @SqlQuery("Select * from task where flatID = :flatID")
    @RegisterBeanMapper(Task.class)
    Collection<Task> getTaskByFlat(@BindBean Flat flat);

    @Override
    @SqlQuery("SELECT task.taskid,taskname,description,flatid,completed,requestedDate FROM task " +
            "inner join assigned on task.taskId = assigned.taskid " +
            "where userid = :userID")
    @RegisterBeanMapper(Task.class)
    Collection<Task> getTaskByUser(@Bind("userID") String userID);
}
