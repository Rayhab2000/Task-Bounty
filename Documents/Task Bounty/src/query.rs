use crate::{storage, types::{Task, TaskStatus}};
use soroban_sdk::{Env, String, Vec};

fn all_tasks(env: &Env) -> Vec<Task> {
    let count = storage::get_task_counter(env);
    let mut tasks: Vec<Task> = Vec::new(env);

    for task_id in 1..=count {
        if storage::task_exists(env, task_id) {
            tasks.push_back(storage::get_task(env, task_id));
        }
    }

    tasks
}

pub fn get_all_tasks(env: &Env) -> Vec<Task> {
    all_tasks(env)
}

pub fn get_tasks_by_category(env: &Env, category: String) -> Vec<Task> {
    let mut results: Vec<Task> = Vec::new(env);

    for task in all_tasks(env).iter() {
        if task.category == category {
            results.push_back(task.clone());
        }
    }

    results
}

pub fn get_tasks_by_tag(env: &Env, tag: String) -> Vec<Task> {
    let mut results: Vec<Task> = Vec::new(env);

    for task in all_tasks(env).iter() {
        if task.tags.contains(tag.clone()) {
            results.push_back(task.clone());
        }
    }

    results
}

pub fn get_tasks_by_status(env: &Env, status: TaskStatus) -> Vec<Task> {
    let mut results: Vec<Task> = Vec::new(env);

    for task in all_tasks(env).iter() {
        if task.status == status {
            results.push_back(task.clone());
        }
    }

    results
}
