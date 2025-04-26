---
title: Use SpotBugs plugin with multi-project Gradle builds
date: 2023-05-22
---

Based on [Sharing build logic between subprojects Sample]:

`buildSrc/build.gradle`

```groovy
repositories {
    gradlePluginPortal() // so that external plugins can be resolved in dependencies section
}

dependencies {
    implementation 'com.github.spotbugs.snom:spotbugs-gradle-plugin:5.0.14'
}
```

`buildSrc/src/main/groovy/myproject.java-common-conventions.gradle`

```groovy
plugins {
    id 'com.github.spotbugs'
}
```

[Sharing build logic between subprojects Sample]: https://docs.gradle.org/current/samples/sample_convention_plugins.html
