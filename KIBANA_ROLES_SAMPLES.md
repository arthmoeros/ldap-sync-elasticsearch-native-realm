# Kibana Roles using Elasticsearch API

Kibana requires Elasticsearch roles with its application definition to allow users to login, here are some samples:

## All features read access on all spaces (resources), All Elasticsearch indices read

```json
{
  "cluster" : [ ],
  "indices" : [
    {
      "names" : [
        "*"
      ],
      "privileges" : [
        "read"
      ],
      "allow_restricted_indices" : false
    }
  ],
  "applications" : [
    {
      "application" : "kibana-.kibana",
      "privileges" : [
        "feature_discover.read",
        "feature_visualize.read",
        "feature_dashboard.read",
        "feature_dev_tools.read",
        "feature_advancedSettings.read",
        "feature_indexPatterns.read",
        "feature_savedObjectsManagement.read",
        "feature_graph.read",
        "feature_apm.read",
        "feature_maps.read",
        "feature_canvas.read",
        "feature_infrastructure.read",
        "feature_logs.read",
        "feature_siem.read",
        "feature_uptime.read"
      ],
      "resources" : [
        "*"
      ]
    }
  ],
  "run_as" : [ ],
  "metadata" : { },
  "transient_metadata" : {
    "enabled" : true
  }
}
```

## Specific features all access, "hyper" space only, All Elasticsearch indices read

```json
{
  "cluster" : [ ],
  "indices" : [
    {
      "names" : [
        "*"
      ],
      "privileges" : [
        "read"
      ],
      "allow_restricted_indices" : false
    }
  ],
  "applications" : [
    {
      "application" : "kibana-.kibana",
      "privileges" : [
        "feature_discover.all",
        "feature_visualize.all",
        "feature_dashboard.all",
        "feature_indexPatterns.all"
      ],
      "resources" : [
        "space:hyper"
      ]
    }
  ]
}
```

## Previous roles merged

```json
{
  "cluster" : [ ],
  "indices" : [
    {
      "names" : [
        "*"
      ],
      "privileges" : [
        "read"
      ],
      "allow_restricted_indices" : false
    }
  ],
  "applications" : [
    {
      "application" : "kibana-.kibana",
      "privileges" : [
        "feature_discover.read",
        "feature_visualize.read",
        "feature_dashboard.read",
        "feature_dev_tools.read",
        "feature_advancedSettings.read",
        "feature_indexPatterns.read",
        "feature_savedObjectsManagement.read",
        "feature_graph.read",
        "feature_apm.read",
        "feature_maps.read",
        "feature_canvas.read",
        "feature_infrastructure.read",
        "feature_logs.read",
        "feature_siem.read",
        "feature_uptime.read"
      ],
      "resources" : [
        "*"
      ]
    },
    {
      "application" : "kibana-.kibana",
      "privileges" : [
        "feature_discover.all",
        "feature_visualize.all",
        "feature_dashboard.all",
        "feature_indexPatterns.all"
      ],
      "resources" : [
        "space:hyper"
      ]
    }
  ]
}
```