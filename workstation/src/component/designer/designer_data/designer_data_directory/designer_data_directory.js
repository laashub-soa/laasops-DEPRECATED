import axios from "axios";

async function query_designer_data_directory() {
  let net_request_result = await axios.post("/distribution/data/directory/select", {});
  if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
  let original_tree_list = net_request_result.data;
  // adapter list to tree
  const name_str = "name";
  const description_str = "description";
  const children_str = "children";

  function setup_tree(pid, parent_level_str) {
    const cur_tree_level = [];
    let i = original_tree_list.length;
    while (i--) {
      const originalTreeListElement = original_tree_list[i];
      if (originalTreeListElement["pid"] == pid) {
        original_tree_list.splice(i, 1);
        const cur_level_str = parent_level_str + "," + originalTreeListElement["name"];
        const next_tree_level = setup_tree(originalTreeListElement["id"], cur_level_str);
        const cur_tree_data = originalTreeListElement;
        cur_tree_data["cur_level_str"] = cur_level_str;
        cur_tree_data[name_str] = originalTreeListElement["name"];
        cur_tree_data[description_str] = originalTreeListElement[description_str];

        // tree element special attribution
        cur_tree_data["addLeafNodeDisabled"] = true; // disable the leaf
        cur_tree_data["isLeaf"] = false; // disable the leaf

        if (next_tree_level.length > 0) {
          cur_tree_data[children_str] = next_tree_level;
        }
        cur_tree_level.push(cur_tree_data);
      }
    }
    return cur_tree_level;
  }

  return setup_tree(-1, '');
}

async function insert_designer_data_directory(data_directory) {
  let net_request_result = await axios.post("/distribution/data/directory/insert", data_directory);
  if (!net_request_result || !net_request_result.status || net_request_result.status != 200 || !net_request_result.data) return;
  return net_request_result.data;
}


export default {
  query_designer_data_directory,
  insert_designer_data_directory
}
