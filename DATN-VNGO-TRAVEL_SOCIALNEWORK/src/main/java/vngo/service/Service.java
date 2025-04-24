package vngo.service;

import java.util.List;

public interface Service<Model, KeyType>{
     public void insert(Model T);
     public Model update(Model model);
     public boolean delete(KeyType T);
     public Model getById(KeyType T);
     public List<Model> getAll();
}
