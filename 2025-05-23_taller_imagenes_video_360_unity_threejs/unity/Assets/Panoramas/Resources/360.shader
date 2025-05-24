Shader "Custom/360"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
        // No necesitamos _Glossiness y _Metallic para un skybox unlit,
        // pero los mantendré por ahora si quieres que siga siendo un Surface Shader base.
        // Si quieres que sea unlit de verdad, estos se eliminarían.
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        // CAMBIO 1: DESACTIVAR BACKFACE CULLING
        // Por defecto, un shader "cull back", lo que significa que las caras traseras no se renderizan.
        // Para ver el interior de la esfera, necesitamos renderizar ambos lados o solo las caras delanteras desde adentro.
        // Al escalar la esfera a (-1,-1,-1), sus normales "miran" hacia adentro,
        // así que el culling estándar funcionaría. Pero para mayor seguridad o para un shader puro de 360,
        // es común deshabilitarlo para renderizar ambos lados.
        Cull Off 

        // CAMBIO 2: HACER EL SHADER UNLIT (SIN ILUMINACIÓN)
        // Para que la imagen o video del skybox se vea tal cual, sin afectar por las luces de la escena.
        // Si no cambias esto, tu skybox se verá afectado por las luces, lo cual no es el efecto deseado.
        // Reemplazamos '#pragma surface surf Standard' por un enfoque Unlit.
        // Puedes optar por un Vertex/Fragment Shader simple o modificar el Surface Shader para que sea unlit.

        // OPCIÓN A: Convertir a un simple Vertex/Fragment Shader (Más común y ligero para Skyboxes)
        // Esto es lo que se parece más al "Unlit/Texture" que te recomendé.
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            fixed4 _Color; // Necesitamos el color aquí también si lo usas para tintar

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv) * _Color; // Aplicar color si es necesario
                return col;
            }
            ENDCG
        }
    }
    FallBack "Unlit/Texture" // Un fallback más apropiado
}