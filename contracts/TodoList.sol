pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;

    string name;
    string father;
    string mother;
    string bloodg;
   
    uint age;
    uint weight;
    uint height;
    uint phone;

    string gender;
    // bool completed;
    
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,

    string name,
    string father,
    string mother,
    string bloodg,

    uint age,
    uint weight,
    uint height,
    uint phone,

    string gender
    
  );

  // event TaskCompleted(
  //   uint id,
  //   bool completed
  // );

  event taskaccessed(
    uint id
  );

  constructor() public {
    createTask("Me","Father","Mother","AB+",12,25,100,9259259259,"M");
  }

  function retTask(uint _id) public {
    emit taskaccessed(_id);
     
  }

  function createTask(string memory _name, 
                      string memory _father,
                      string memory _mother,
                      string memory _bloodg,
                      uint _age,
                      uint _weight,
                      uint _height,
                      uint _phone,
                      string memory _gender
                      ) public {

    taskCount ++;
    tasks[taskCount] = Task(taskCount, _name, _father, _mother, _bloodg, _age, _weight, _height, _phone, _gender);
    emit TaskCreated(taskCount, _name, _father, _mother, _bloodg, _age, _weight, _height, _phone, _gender);
  }

  // function toggleCompleted(uint _id) public {
  //   Task memory _task = tasks[_id];
  //   _task.completed = !_task.completed;
  //   tasks[_id] = _task;
  //   emit TaskCompleted(_id, _task.completed);
  // }
}
